import mongoose from "mongoose";

const tagProductSchema = new mongoose.Schema(
  {
    vedioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    productLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export const tagProduct = mongoose.model("TagProduct", tagProductSchema);
