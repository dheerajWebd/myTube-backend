import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import uplodOnCloudinary from "../utils/cloudinary.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";

export const channelController = asyncHandler(async (req, res, next) => {
  const isVarified = await User.findById(req.user?._id);
  if (!isVarified)
    throw new ErrorFormater(
      "unathoriztion request user is no not Verified ",
      [""],
      403
    );

  const { description, handle, channelName, isChildren, link } = req.body;

  if (!channelName || !handle)
    throw new ErrorFormater(
      "the channel name or handle is required ",
      [""],
      403
    );
  const isHandle = await Channel.findOne({
    $or: [{ owner: req.user?._id }, { handle }],
  });

  if (isHandle)
    throw new ErrorFormater(
      "heandle is taken bay other user or you have already created a channel ",
      "",
      403
    );
  const uplodeChannelCoverimg = await uplodOnCloudinary(
    req.file?.path,
    "/channelCoverImg/",
    "channelcoverimage"
  );

  console.log(uplodeChannelCoverimg?.url);
  const createdChannel = await Channel.create({
    description: description || "",
    owner: isVarified._id,
    channelName,
    handle,
    coverImg: uplodeChannelCoverimg?.url || "",
    isChildren: isChildren || false,
    link: link || [{ url: "", title: "" }],
  });

  if (!createdChannel)
    throw new ErrorFormater(
      "server error data is not save while save in db plz try agan later "[""],
      500
    );

  res
    .status(201)
    .json(
      new successResponse(201, createdChannel, "channel created successfully")
    );
});

export const editChannel = asyncHandler(async (req, res, next) => {
  const { channelId, channelName, isChildren, link, description } = req.body;
  if (!channelId) {
    throw new ErrorFormater(
      "channelId is required for edit channel details",
      "",
      400
    );
  }
  const channel = await Channel.findById({
    $and: [{ _id: channelId }, { owner: req.user._id }],
  });
  if (!channel)
    throw new ErrorFormater(
      "channelId is wrong plz send the correct channelId ",
      "",
      404
    );
  const updatedchannel = await Channel.save(
    {
      $set: {
        channelName: channelName || channel.channelName,
        isChildren: isChildren || channel.isChildren,
        link: link || channel.link,
        description: description || channel.description,
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );

  if (!updatedchannel)
    throw new ErrorFormater(
      "server error to save in db plz reupdate the channel deatials",
      "",
      500
    );

  res
    .status(200)
    .json(new successResponse(200, updatedchannel, "channel was updated"));
});

export const editChannelCoverImg = asyncHandler(async (req, res, next) => {
  const coverImg = req.file.coverImg.path;
  const { channelId } = req.body;
  console.log(coverImg);
  if (!coverImg || !channelId) {
    return new ErrorFormater(
      "cover image or channelId is required to edit the cover image "
    );
  }
  const uplodeChannelCoverimg = await uplodOnCloudinary(
    req.file?.path,
    "/channelCoverImg/",
    "channelcoverimage"
  );
  if (!uplodeChannelCoverimg || !uplodeChannelCoverimg.url) {
    return new ErrorFormater(
      "server error to upload on cloud reupload",
      "",
      400
    );
  }
 await updatedchannelcoverImg.save(
    channelId,
    {
      $set: {
        coverImg: uplodeChannelCoverimg.url,
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );

  if (!updatedchannelcoverImg)
    new ErrorFormater("server error to upload on db reupload", "", 400);

  res
    .status(200)
    .json(
      new successResponse(200, updatedchannelcoverImg, "updated cover image")
    );
});
