import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ReceiptsService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  async processReceiptImage(file: { buffer: Buffer; mimetype: string }, userId: string) {
    if (!file) {
      throw new BadRequestException('No receipt image provided');
    }

    // Convert image buffer to base64 for OpenAI Vision API
    const base64Image = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert receipt OCR and data extraction assistant. 
Extract the bill details from the provided image and return ONLY a strict JSON object with this exact structure:
{
  "title": "Restaurant or Vendor Name",
  "totalAmount": 0.00,
  "taxAndCharges": 0.00,
  "items": [
    { "name": "Item Name", "price": 0.00 }
  ]
}
If any value is missing, default numbers to 0.0 and strings to "Unknown". Do not include markdown codeblocks like \`\`\`json, just return the raw JSON string.`,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract the bill details from this receipt:' },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new BadRequestException('Failed to extract data from receipt image');
      }

      // Clean up potential markdown formatting from response
      const cleanedJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const extractedData = JSON.parse(cleanedJson);

      // Save the structured bill and its line items into Postgres using Prisma
      const savedBill = await this.prisma.bill.create({
        data: {
          title: extractedData.title || 'Untitled Bill',
          totalAmount: parseFloat(extractedData.totalAmount) || 0.0,
          taxAndCharges: parseFloat(extractedData.taxAndCharges) || 0.0,
          items: {
            create: (extractedData.items || []).map((item: any) => ({
              name: item.name,
              price: parseFloat(item.price) || 0.0,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return {
        success: true,
        message: 'Receipt successfully scanned and saved!',
        bill: savedBill,
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new BadRequestException('Failed to process receipt with AI OCR');
    }
  }
}
