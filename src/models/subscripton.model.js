import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      reuired: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
  },
  { timestamps: true }
);
subscriptionSchema.index({ userId: 1, channelId: 1 }, { unique: true });

export const subscription = mongoose.model("Subscription", subscriptionSchema);
