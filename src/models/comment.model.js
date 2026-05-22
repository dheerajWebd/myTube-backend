import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    hertByOwner: {
      type: Boolean,
      default: false,
    },
    commentText: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      default: null,
    },
  },
  {
    discriminatorKey: "type",
    collation: "comments",
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", commentSchema);

export const videoComment = Comment.discriminator(
  "videoComment",
  new mongoose.Schema({
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },
  })
);
export const postComment = Comment.discriminator(
  "postComment",
  new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
  })
);
