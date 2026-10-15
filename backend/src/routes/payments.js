import axios from "axios";
import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.post("/payments/initiate", async (req, res) => {
  try {
    const { participantId} = req.body;

    if (!participantId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Find participant
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { bill: true },
    });
    
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    const email = participant.email;

    // Prevent double payment
    if (participant.hasPaid) {
      return res.status(400).json({ error: "Participant already paid" });
    }

    if (participant.bill.status !== "open") {
      return res.status(400).json({ error: "Bill is not open" });
    }

    // Initialize Paystack transaction
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: participant.amountOwed * 100, // convert to kobo
        callback_url: `${process.env.BASE_URL}/payment-success`,
        metadata: {
          billId: participant.billId,
          participantId: participant.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference } =
      paystackResponse.data.data;
      
      await prisma.payment.create({
        data: {
          participantId: participant.id,
          billId: participant.billId,
          reference,
          amount: participant.amountOwed,
          status: "initialized",
        },
      });

    return res.json({
      authorizationUrl: authorization_url,
      reference,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

export default router;
