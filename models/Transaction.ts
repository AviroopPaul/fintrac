import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount"],
  },
  type: {
    type: String,
    required: [true, "Please specify the type"],
    enum: ["income", "expense"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category"],
  },
  date: {
    type: Date,
    required: [true, "Please specify a date"],
  },
  user_id: {
    type: String,
    required: [true, "User ID is required"],
    index: true,
  }
}, {
  timestamps: true,
});

transactionSchema.index({ user_id: 1, date: -1 });

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  user_id: string;
} 