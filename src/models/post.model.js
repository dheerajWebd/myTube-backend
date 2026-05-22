import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postData: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      required: true,
    },
    links: {
      name: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      url: {
        type: String,
        trim: true,
      },
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Channel",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
