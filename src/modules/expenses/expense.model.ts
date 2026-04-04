import mongoose, { Schema, Document, Types } from "mongoose";
import { ExpenseStatus } from "./expense.types";

export interface ExpenseDocument extends Document {
  title: string;
  amount: number;
  currency: "INR" | "USD";
  category: string;

  createdBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;

  status: ExpenseStatus;

  submittedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<ExpenseDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },

    category: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: Object.values(ExpenseStatus),
      default: ExpenseStatus.DRAFT,
      index: true,
    },

    submittedAt: Date,
    approvedAt: Date,
    paidAt: Date,

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ExpenseModel = mongoose.model<ExpenseDocument>(
  "Expense",
  expenseSchema
);