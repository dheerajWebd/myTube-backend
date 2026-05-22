import { Channel } from "../models/channel.model.js";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import successResponse from "../utils/successResponse.js";
import uplodOnCloudinary from "../utils/cloudinary.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";

export const videoControll = asyncHandler(async (req, res, next) => {
  const isVarified = await Channel.findById(req.params._id);

  if (!isVarified)
    throw new ErrorFormater(
      "unathoriztion request channel is no not find ",
      [""],
      404
    );

  const { isPublish, decription, tittle, isChildren } = req.body;
  const { video, thumbnail } = req.files;

  if (
    [decription, tittle].some(field => field === "") ||
    !video ||
    !thumbnail ||
    isPublish === undefined ||
    isChildren === undefined
  ) {
    throw new ErrorFormater(
      "isPublish, decription, tittle ,isChildren,video,thumbnail this filds are required",
      [""],
      404
    );
  }

  const thumbnailPath = thumbnail[0].path;
  const videoPath = video[0].path;

  const thumbnailUplode = await uplodOnCloudinary(
    thumbnailPath,
    `/video/thumbnail/${Date.now()}`,
    "videoThumdnails"
  );

  const videolUplode = await uplodOnCloudinary(
    videoPath,
    `/video/userVideo/${Date.now()}`,
    "videos"
  );

  const postedVideo = await Video.create({
    isPublish,
    owner: req.params._id,
    decription,
    tittle,
    isChildren,
    video: {
      publicId: videolUplode?.public_id,
      url: videolUplode?.url,
    },
    thumbnail: {
      publicId: thumbnailUplode?.public_id,
      url: thumbnailUplode?.url,
    },
  });

  const updateVideoCount = await Channel.findByIdAndUpdate(
    req.params._id,
    {
      $inc: { videosCount: 1 },
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new successResponse(
        201,
        { postedVideo, updateVideoCount },
        "video uploded successfully "
      )
    );
});

export const editVideos = asyncHandler(async (req, res, next) => {
  const { tittle, tag, decription, video_id, channelId } = req.body;
  if (!tittle || !tag || !decription)
    throw new ErrorFormater(
      "required tittle tag or discription for edit",
      "",
      400
    );

  const isVideo = await Video.findOne({
    $and: [{ _id: video_id }, { owner: channelId }],
  });

  if (!isVideo)
    throw new ErrorFormater(
      "video_id is wrong plz send correct video_id ",
      "",
      400
    );

  const updatedvideo = await isVideo.save(
    {
      $set: {
        tittle,
        decription,
        tag,
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );

  if (!updatedvideo) {
    throw ErrorFormater(
      "server error to save in db plz reupdate th vedio deatials ",
      "",
      500
    );
  }
  res
    .status(200)
    .json(new successResponse(200, updatedvideo, "video updated successfully"));
});

export const editThumbnail = asyncHandler(async (req, res, next) => {
  if (!req?.file?.path || !req?.body?.video_id || !req?.body?.channelId) {
    return new ErrorFormater(
      "file is not find plz send the image file and video_id in body and channelId in body ",
      "",
      400
    );
  }
  const updatedThumbnail = await Video.findone({
    $and: [{ _id: req.body.video_id }, { owner: req.body.channelId }],
  });

  if (!updatedThumbnail) {
    return new ErrorFormater(
      "does not find the video to send the video id so plz send correct id ",
      "",
      404
    );
  }
  const thumbnailUplode = await uplodOnCloudinary(
    req.file.path,
    "/video/thumbnail/",
    "videoThumdnails"
  );
  if (!thumbnailUplode) {
    return new ErrorFormater(
      "server error to uplode the thumbnail plz reupload the thumbnail image file",
      "",
      500
    );
  }

  await updatedThumbnail.save(
    req.body.video_id,
    {
      $set: {
        thumbnail: {
          publicId: thumbnailUplode.public_id,
          url: thumbnailUplode.url,
        },
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );
  res
    .status(200)
    .json(
      new successResponse(
        200,
        updatedThumbnail,
        "thumbnail updated successfully"
      )
    );
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
  const deletedVideo = await Video.findByIdAndDelete({
    $and: [{ _id: req.params._id }, { owner: req.params.ChannelId }],
  });

  await Channel.findByIdAndUpdate(
    req.params._id,
    {
      $inc: { videosCount: 1 },
    },
    { new: true }
  );
  if (!deletedVideo) {
    throw new ErrorFormater(
      "does not find the video to send the video id so plz send correct id ",
      "",
      404
    );
  }
  res
    .status(200)
    .json(
      new successResponse(
        200,
        {},
        "deleted video successfully enjoy the services or any typos in spallings any where  to so sorry"
      )
    );
});
