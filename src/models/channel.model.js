import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },

    coverImg: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    videosCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    subCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    link: {
      type: [
        {
          _id: false,
          url: {
            type: String,
            trim: true,
          },
          title: {
            type: String,
            trim: true,
          },
        },
      ],
      validate: {
        validator: val => val.length <= 8,
        message: "maxlink is allow is 8 ",
      },
    },
    isChildren: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export const Channel = mongoose.model("Channel", channelSchema);
