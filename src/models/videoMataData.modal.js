import mongoose from "mongoose";

const mataDataSchema = new mongoose.Schema({
  duration: {
    type: Number,
  },
  aspectRatio: {
    type: String,
  },
  videoType: {
    type: String,
    enum: ["sort", "long"],
  },
  hight: {
    type: Number,
  },
  width: Number,
});

mataDataSchema.methods.checkType = function (aspectRatio, duration) {
  if (aspectRatio === "1920X1080" && duration <= 2000) {
    this.videoType = "sort";
  } else {
    this.videoType = "long";
  }
};
export const metaData = mongoose.model("metaData", mataDataSchema);
