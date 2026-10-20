import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptsService } from './receipts.service.js';


@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post('scan')
  @UseInterceptors(FileInterceptor('image'))
  async scanReceipt(
    @UploadedFile() file: { buffer: Buffer; mimetype: string; originalname: string },
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required under form-field "image"');
    }
    return this.receiptsService.processReceiptImage(file, userId);
  }
}
