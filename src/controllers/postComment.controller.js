import mongoose from "mongoose";
import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import { postComment } from "../models/comment.model.js";
import { Channel } from "../models/channel.model.js";
import { Post } from "../models/post.model.js";
import successResponse from "../utils/successResponse.js";

export const postCommentController = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 401);
  const { commentText, postId, parentId, channelId } = req.body;

  if (!commentText || !channelId || !postId)
    throw new ErrorFormater(
      "this fild are required commentText, postId",
      "",
      400
    );

  const ispostId = mongoose.Types.ObjectId.isValid(postId);
  const isChannelId = mongoose.Types.ObjectId.isValid(channelId);
  const isparentId = parentId
    ? mongoose.Types.ObjectId.isValid(parentId)
    : true;

  if (!ispostId || !isChannelId || !isparentId)
    throw new ErrorFormater(
      "postId ChannelId parentId or plz enter valid ids ",
      "",
      400
    );

  const channel = await Channel.findById(channelId);
  const post = await Post.findById(postId);

  if (!post) throw new ErrorFormater("post not found with this id", "", 404);

  if (!channel) throw new ErrorFormater("Invalid IDs provided", "", 400);

  const postCommentCreated = await postComment.create({
    owner: channelId,
    commentText, // feature upgrade remove all tag or attributed in text
    postId: postId,
    parentId: parentId || null,
  });

  if (!postCommentCreated)
    throw new ErrorFormater("server error while saveing the comment ", "", 500);

  res
    .status(200)
    .json(
      new successResponse(
        200,
        postCommentCreated,
        "comment saved successfully "
      )
    );
});
