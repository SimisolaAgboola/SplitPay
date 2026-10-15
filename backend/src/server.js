import express from "express";
import app from "./app.js";
import webhookRoutes from "./routes/webhook.js";

const server = express();
const PORT = process.env.PORT || 4000;

// Webhook route MUST use raw body for Paystack signature verification
server.use("/webhook", express.raw({ type: "application/json" }), webhookRoutes);

// All other routes handled by app.js
server.use(app);
server.use(express.json());

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







