import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";
import { Channel } from "../models/channel.model.js";
import { Comment, videoComment } from "../models/comment.model.js";
import mongoose from "mongoose";

export const CommentController = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 401);
  const { commentText, videoId, parentId, channelId } = req.body;

  if (!commentText || !channelId || !videoId)
    throw new ErrorFormater(
      "this fild are required commentText, videoId",
      "",
      400
    );

  const isVideoId = mongoose.Types.ObjectId.isValid(videoId);
  const isChannelId = mongoose.Types.ObjectId.isValid(channelId);
  const isparentId = parentId
    ? mongoose.Types.ObjectId.isValid(parentId)
    : true;

  if (!isVideoId || !isChannelId || !isparentId)
    throw new ErrorFormater(
      "VideoId ChannelId parentId or plz enter valid ids ",
      "",
      400
    );

  const channel = await Channel.findById(channelId);

  if (!channel) throw new ErrorFormater("Invalid IDs provided", "", 400);

  const CommentCreated = await videoComment.create({
    owner: channelId,
    commentText, // feature upgrade remove al tag or attributed in text
    videoId: videoId,
    parentId: parentId || null,
  });

  if (!CommentCreated)
    throw new ErrorFormater("server error while saveing the comment ", "", 500);
  res
    .status(200)
    .json(
      new successResponse(200, CommentCreated, "comment saved successfully ")
    );
});

export const editcommentController = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 401);
  const { commentText, CommentId } = req.body;

  if (!commentText || !CommentId)
    throw new ErrorFormater(
      "this fild are required commentText, commentId",
      "",
      400
    );

  const isCommentId = mongoose.Types.ObjectId.isValid(CommentId);

  if (!isCommentId)
    throw new ErrorFormater(
      "VideoId CommentId or plz enter valid ids ",
      "",
      400
    );

  const updatedComment = await Comment.findByIdAndUpdate(
    channelId,
    {
      $set: {
        commentText,
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );

  if (!updatedComment)
    throw new ErrorFormater("Invalid CommentId provided", "", 400);

  res
    .status(200)
    .json(
      new successResponse(200, updatedComment, "comment edited successfully ")
    );
});

export const heartByOwnercommentController = asyncHandler(
  async (req, res, next) => {
    const user = req?.user;

    if (!user)
      throw new ErrorFormater("unathorised requested plz login", "", 401);
    const { hertByOwner, channelId } = req.body;

    if (!hertByOwner || !channelId)
      throw new ErrorFormater("this fild are required hertByOwner", "", 400);

    const hertedComment = await Comment.findByIdAndUpdate(
      channelId,
      {
        $set: {
          hertByOwner,
        },
      },
      {
        new: true,
        validateDeforeSave: false,
      }
    );

    if (!hertedComment)
      throw new ErrorFormater("Invalid CommentId provided", "", 400);

    res
      .status(200)
      .json(
        new successResponse(200, hertedComment, "comment edited successfully ")
      );
  }
);

export const deletedcommentController = asyncHandler(async (req, res, next) => {
  const user = req?.user;

  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 401);
  const { channelId } = req.body;

  if (!channelId)
    throw new ErrorFormater("this fild are required hertByOwner", "", 400);

  const deletedComment = await Comment.findByIdAndDelete(channelId);

  if (!deletedComment)
    throw new ErrorFormater("Invalid CommentId provided", "", 400);

  res
    .status(200)
    .json(
      new successResponse(200, deletedComment, "comment edited successfully ")
    );
});

export const getcommentController = asyncHandler(async (req, res, next) => {
  
  const { channelId } = req.body;

  if (!channelId)
    throw new ErrorFormater("this fild are required hertByOwner", "", 400);

  const findComment = await Comment.findById(channelId);

  if (!findComment)
    
    throw new ErrorFormater("Invalid CommentId provided", "", 400);

  res
    .status(200)
    .json(
      new successResponse(200, findComment, "comment edited successfully ")
    );
});
