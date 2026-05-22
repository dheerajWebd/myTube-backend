import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import { Channel } from "../models/channel.model.js";
import successResponse from "../utils/successResponse.js";
import { SaveVideo } from "../models/saveVideo.model.js";

/**
 * @description save video
 */

export const saveVideoController = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 404);
  const { title, discription, videoId, channelId } = req.body;

  if (!title || !videoId || !channelId)
    throw new ErrorFormater(
      "this fild are required title, videoId, channelId",
      "",
      402
    );

  const channel = await Channel.findById(channelId);

  if (!channel) throw new ErrorFormater("channel is not found ", "", 404);

  const saveVideoCreated = await SaveVideo.create({
    owner: channelId,
    title,
    discription: discription || "",
    videoId: [videoId],
  });

  if (!saveVideoCreated)
    throw new ErrorFormater("server error while saveing the vedio ", "", 500);

  res
    .status(200)
    .json(
      new successResponse(200, saveVideoCreated, "video saved successfully ")
    );
});

/**
 * @description add video to saveVedio
 */

export const addsaveVideoController = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 404);
  const { videoId, sevedvideoId } = req.body;

  if (!sevedvideoId || !videoId)
    throw new ErrorFormater(
      "this fild are required videoId, sevedvideoId",
      "",
      402
    );

  const saveVedio = await SaveVideo.findById(sevedvideoId);

  if (!saveVedio) throw new ErrorFormater("saveVedio is not found ", "", 404);

  saveVedio?.videoId.push(videoId);

  const updatedsaveVedio = await saveVedio.save({
    validateDeforeSave: false,
  });

  if (!updatedsaveVedio)
    throw new ErrorFormater("server error while created saveVedioed ", "", 500);

  res
    .status(200)
    .json(
      new successResponse(
        200,
        updatedsaveVedio,
        "palylist is updated successfully "
      )
    );
});

/**
 * @description edit saveVedio
 */

export const editsaveVideoController = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 404);
  const { title, discription, ispublic, saveVedioId } = req.body;

  if (!title || !saveVedioId)
    throw new ErrorFormater(
      "this fild are required title, saveVedioId",
      "",
      402
    );

  const savevideo = await savevideo.findByIdandUpdate(
    saveVedioId,
    {
      $set: {
        title,
        discription: discription || "",
        ispublic: ispublic || true,
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );

  if (!savevideo) throw new ErrorFormater("savevideo is not found ", "", 404);

  res
    .status(200)
    .json(new successResponse(200, savevideo, "video save successfully "));
});

/**
 * @description delete save total list
 */

export const deletesavevideoController = asyncHandler(
  async (req, res, next) => {
    const user = req?.user;
    if (!user)
      throw new ErrorFormater("unathorised requested plz login", "", 404);
    const { saveVedioId } = req.body;

    if (!saveVedioId)
      throw new ErrorFormater("this fild are required saveVedioId", "", 402);

    const saveVedio = await saveVedio.findAndDelete({ saveVedioId });

    if (!saveVedio) throw new ErrorFormater("playlist is not found ", "", 404);

    res
      .status(200)
      .json(
        new successResponse(
          200,
          saveVedio,
          "saved palylist is deleted successfully "
        )
      );
  }
);
/**
 * @description remove one video in save list
 */
export const removeOneVideoInSaveListController = asyncHandler(
  async (req, res, next) => {
    const user = req?.user;

    if (!user)
      throw new ErrorFormater("unathorised requested plz login", "", 404);
    const { videoId, saveVedioId, channelId } = req.body;

    if (!videoId || !saveVedioId)
      throw new ErrorFormater(
        "this fild are required videoId, saveVedioId",
        "",
        402
      );

    const isChannel = await Channel.findById(channelId);

    if (!isChannel || isChannel?.owner != user._id)
      throw new ErrorFormater(
        "channel is not found or unathorised request",
        "",
        404
      );

    const saveVedio = await saveVedio.findById(saveVedioId);

    if (!saveVedio) throw new ErrorFormater("saveVedio is not found ", "", 404);

    saveVedio?.videoId.pull(videoId);
   
    const updatedsaveVedio = await saveVedio.save({
      validateDeforeSave: false,
    });

    if (!updatedsaveVedio)
      throw new ErrorFormater(
        "server error while remove video in save list ",
        "",
        500
      );

    res
      .status(200)
      .json(
        new successResponse(
          200,
          updatedsaveVedio,
          "palylist is updated successfully "
        )
      );
  }
);
