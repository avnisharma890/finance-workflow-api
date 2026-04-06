import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import expenseRoutes from "./modules/expenses/expense.routes";
import { mockAuth } from "./middleware/mockAuth";

const app = express();

// middleware
app.use(express.json());
app.use(mockAuth);

// routes
app.use("/expenses", expenseRoutes);

// DB + server start
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/finance");
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

start();