import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import { Channel } from "../models/channel.model.js";
import { Playlist } from "../models/playlist.model.js";
import successResponse from "../utils/successResponse.js";

export const PlaylistController = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 404);
  const { title, discription, ispublic, videoId, channelId } = req.body;

  if (!title || !videoId || !channelId)
    throw new ErrorFormater(
      "this fild are required title, videoId, channelId",
      "",
      402
    );

  const channel = await Channel.findById(channelId);

  if (!channel) throw new ErrorFormater("channel is not found ", "", 404);

  const PlaylistCreated = await Playlist.create({
    owner: channelId,
    title,
    discription: discription || "",
    videoId: [videoId],
  });

  if (!PlaylistCreated)
    throw new ErrorFormater("server error while created playlisted ", "", 500);

  res
    .status(200)
    .json(
      new successResponse(
        200,
        PlaylistCreated,
        "palylist is created successfully "
      )
    );
});

export const addVideoPlaylistController = asyncHandler(
  async (req, res, next) => {
    const user = req?.user;
    if (!user)
      throw new ErrorFormater("unathorised requested plz login", "", 404);
    const { videoId, PlaylistId, channelId } = req.body;

    if (!PlaylistId || !videoId)
      throw new ErrorFormater(
        "this fild are required title, videoId, PlaylistId",
        "",
        402
      );

    const playlist = await Playlist.find({
      $and: [{ _id: PlaylistId }, { owner: channelId }],
    });
    console.log(playlist);

    if (!playlist) throw new ErrorFormater("playlist is not found ", "", 404);

    playlist?.videoId.push(videoId);
    const updatedplaylist = await playlist.save({ validateDeforeSave: false });
    if (!updatedplaylist)
      throw new ErrorFormater(
        "server error while created playlisted ",
        "",
        500
      );

    res
      .status(200)
      .json(
        new successResponse(
          200,
          updatedplaylist,
          "palylist is updated successfully "
        )
      );
  }
);

export const editPlaylistController = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 404);
  const { title, discription, ispublic, playlistId } = req.body;

  if (!title || !playlistId)
    throw new ErrorFormater(
      "this fild are required title, playlistId",
      "",
      402
    );

  const playlist = await playlist.findByIdandUpdate(
    {
      $and: [{ _id: playlistId }, { owner: channelId }],
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

  if (!playlist) throw new ErrorFormater("playlist is not found ", "", 404);

  res
    .status(200)
    .json(
      new successResponse(200, playlist, "palylist is updated successfully ")
    );
});

export const deletePlaylistController = asyncHandler(async (req, res, next) => {
  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 404);
  const { playlistId, channelId } = req.body;

  if (!playlistId || !channelId)
    throw new ErrorFormater(
      "this fild are required playlistId, channelId",
      "",
      402
    );

  const playlist = await playlist.findByIdandDelete({
    $and: [{ _id: playlistId }, { owner: channelId }],
  });

  console.log(playlist);

  if (!playlist)
    throw new ErrorFormater(
      "playlist is not found or unathorised request",
      "",
      404
    );

  res
    .status(200)
    .json(
      new successResponse(200, playlist, "palylist is deleted successfully ")
    );
});

export const removeOneVideoInPlaylistController = asyncHandler(
  async (req, res, next) => {
    const user = req?.user;

    if (!user)
      throw new ErrorFormater("unathorised requested plz login", "", 404);
    const { videoId, playlistId } = req.body;

    if (!videoId || !playlistId)
      throw new ErrorFormater(
        "this fild are required videoId, playlistId",
        "",
        402
      );

    const playlist = await playlist.findById(playlistId);

    if (!playlist || playlist?.owner != user._id)
      throw new ErrorFormater(
        "playlist is not found or unathorised request",
        "",
        404
      );

    playlist?.videoId.pull(videoId);
    const updatedplaylist = await playlist.save({ validateDeforeSave: false });
    if (!updatedplaylist)
      throw new ErrorFormater(
        "server error while created playlisted ",
        "",
        500
      );

    res
      .status(200)
      .json(
        new successResponse(
          200,
          updatedplaylist,
          "palylist is updated successfully "
        )
      );
  }
);
