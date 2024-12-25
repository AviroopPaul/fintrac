import mongoose from 'mongoose';

export interface Budget {
  _id?: string;
  user_id: string;
  category: string;
  amount: number;
  spent?: number;
  month: string; // Format: "YYYY-MM"
  createdAt?: Date;
  updatedAt?: Date;
}

const BudgetSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  month: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema); 