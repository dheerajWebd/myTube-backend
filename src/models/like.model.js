import mongoose from "mongoose";

const Option = {
  discriminatorKey: "type",
  collection: "likes",
  timestamps: true,
};

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: String,
      required: true,
      enum: ["like", "dislike"],
    },
  },
  Option
);

export const Like = mongoose.model("Like", likeSchema);

export const videoReaction = Like.discriminator(
  "video",
  new mongoose.Schema({
    videoId: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
      required: true,
    },
  })
);
likeSchema.index(
  { user: 1, videoId: 1 },
  { unique: true, partialFilterExpression: { type: "Video" } }
);

// partialFilterExpression this rule apply only on given type
export const postReaction = Like.discriminator(
  "post",
  new mongoose.Schema({
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
  })
);
likeSchema.index(
  { user: 1, postId: 1 },
  { unique: true, partialFilterExpression: { type: "post" } }
);
export const commentReaction = Like.discriminator(
  "comment",
  new mongoose.Schema({
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  })
);
likeSchema.index(
  { user: 1, commentId: 1 },
  { unique: true, partialFilterExpression: { type: "comment" } }
);
