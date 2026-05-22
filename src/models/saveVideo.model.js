import mongoose from "mongoose";

const SaveVideoSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Channel",
      require: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxleanght: 100,
    },
    discription: {
      type: String,
      trim: true,
      maxleanght: 200,
    },
    videoId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
        unique: [true, "this video is already saved"],
      },
    ],
  },
  { timestamps: true }
);

export const SaveVideo = mongoose.model("SaveVideo", SaveVideoSchema);
