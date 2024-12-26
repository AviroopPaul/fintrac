import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          required: true,
          enum: ["user", "assistant"],
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
