import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    transform: (v: string) => parseFloat(v),
  },
  billingCycle: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
  },
  nextBillingDate: {
    type: Date,
    required: true,
    default: () => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    },
  },
  imageUrl: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
