import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Channel",
      require: true,
    },
    ispublic: {
      type: Boolean,
      default: true,
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
      maxleanght: 500,
    },
    videoId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
        unique:[true, "this video is already added in playlist"],
      },
    ],
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
