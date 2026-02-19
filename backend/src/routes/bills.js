import express from "express";
import QRCode from "qrcode";
import prisma from "../db/prisma.js";

const router = express.Router();

router.post("/create-bill", async (req, res) => {
  try {
    const { restaurantId, totalAmount, participants } = req.body;

    if (!restaurantId || !totalAmount || !participants?.length) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Create bill
    const bill = await prisma.bill.create({
      data: {
        totalAmount,
        restaurantId,
        participants: {
          create: participants.map((p) => ({
            name: p.name,
            amountOwed: p.amount,
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    // Generate QR payment link
    const paymentUrl = `https://yourdomain.com/pay/${bill.id}`;
    const qrCode = await QRCode.toDataURL(paymentUrl);

    // Save QR to bill
    await prisma.bill.update({
      where: { id: bill.id },
      data: { qrCode },
    });

    return res.json({
      billId: bill.id,
      qrCode,
      participants: bill.participants,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
