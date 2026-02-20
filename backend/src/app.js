import cors from "cors";
import express from "express";
import billsRouter from "./routes/bills.js";
import paymentsRouter from "./routes/payments.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", billsRouter);
app.use("/api", paymentsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "Server running" });
});

export default app;
