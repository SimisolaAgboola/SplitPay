import crypto from "crypto";
import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET;

    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event !== "charge.success") {
      return res.sendStatus(200); // Ignore other events
    }

    const { reference, amount, metadata } = event.data;

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: { participant: true, bill: true },
    });

    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    // Prevent double-processing
    if (payment.status === "success") {
      return res.sendStatus(200);
    }

    // Update payment
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "success",
        paidAt: new Date(),
      },
    });

    // Mark participant as paid
    await prisma.participant.update({
      where: { id: payment.participantId },
      data: { hasPaid: true },
    });

    // 🔥 Check if bill is fully paid
    const unpaidCount = await prisma.participant.count({
      where: {
        billId: payment.billId,
        hasPaid: false,
      },
    });

    if (unpaidCount === 0) {
      await prisma.bill.update({
        where: { id: payment.billId },
        data: {
          status: "closed",
          isSettled: true,
        },
      });
    }

    return res.sendStatus(200);

  } catch (error) {
    console.error("Webhook error:", error);
    return res.sendStatus(500);
  }
});

export default router;