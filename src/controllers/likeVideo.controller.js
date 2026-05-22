import {
  commentReaction,
  Like,
  postReaction,
  videoReaction,
} from "../models/like.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import successResponse from "../utils/successResponse.js";

export const likeControll = asyncHandler(async (req, res, next) => {
  const userId = req.user;

  if (!userId) throw new ErrorFormater("unauthorized request", "", 401);

  const { reaction, whichlikeId, id } = req.body;

  if (!reaction?.trim() || !whichlikeId || !id)
    throw new ErrorFormater(
      "reaction, whichlikeId and id are required fields ",
      "",
      400
    );

  let model,
    reactedId = id,
    reacted = whichlikeId + "Id",
    responce;
  if (whichlikeId?.trim()?.toLowerCase() === "video") {
    const isvideo = await Video.findById(id);
    if (!isvideo) throw new ErrorFormater("video not found", "", 404);
    model = videoReaction;
  }
  if (whichlikeId?.trim()?.toLowerCase() === "comment") {
    const isComment = await Comment.findById(id);
    if (!isComment) throw new ErrorFormater("Comment not found", "", 404);
    model = commentReaction;
  }
  if (whichlikeId?.trim()?.toLowerCase() === "post") {
    const isPost = await Post.findById(id);
    if (!isPost) throw new ErrorFormater("Post not found", "", 404);
    model = postReaction;
  }

  if (reaction?.trim().toLowerCase() === "like") {
    const deletedReaction = await model.findOneAndDelete({
      userId: userId._id,
      [reacted]: reactedId,
    });
    if (deletedReaction)
      responce = new successResponse(200, {}, "deleted like successfull");

    if (deletedReaction?.reaction === "dislike" || !deletedReaction) {
      const create = await model.create({
        userId: userId._id,
        reaction,
        [reacted]: reactedId,
      });
      responce = new successResponse(
        200,
        create,
        "create or update like successfull"
      );
    }
  }

  if (reaction?.trim().toLowerCase() === "dislike") {
    const deletedReaction = await model.findOneAndDelete({
      userId: userId._id,
      [reacted]: reactedId,
    });
    if (deletedReaction)
      responce = new successResponse(200, {}, "deleted like successfull");

    if (deletedReaction?.reaction === "like" || !deletedReaction) {
      const create = await model.create({
        userId: userId._id,
        reaction,
        [reacted]: reactedId,
      });
      responce = new successResponse(
        200,
        create,
        "create or update dislike successfull"
      );
    }
  }
  res.json(responce);
});