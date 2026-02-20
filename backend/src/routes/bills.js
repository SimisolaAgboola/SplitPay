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

router.get("/bill/:id", async (req, res) => {
    try {
        const { id } = req.params;
    
        const bill = await prisma.bill.findUnique({
            where: { id },
            include: {
                participants: true,
                restaurant: true,
            },
        });
            
        if (!bill) {
            return res.status(404).json({ error: "Bill not found" });
        }

        // Calculate payment summary
        const totalPaid = bill.participants
        .filter((p) => p.hasPaid)
        .reduce((sum, p) => sum + p.amountOwed, 0);
        
        const totalOutstanding = bill.totalAmount - totalPaid;

        return res.json({
            id: bill.id,
            restaurant: bill.restaurant.name,
            totalAmount: bill.totalAmount,
            totalPaid,
            totalOutstanding,
            status: bill.status,
            qrCode: bill.qrCode,
            participants: bill.participants.map((p) => ({
                id: p.id,
                name: p.name,
                amountOwed: p.amountOwed,
                hasPaid: p.hasPaid,
            })),
            createdAt: bill.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


export default router;
