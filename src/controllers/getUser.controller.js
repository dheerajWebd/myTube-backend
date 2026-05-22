import mongoose from "mongoose";
import { Channel } from "../models/channel.model.js";
import { Video } from "../models/video.model.js";

export const channelProfile = async user => {
  const channelProfile = await Channel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId("69cfe01560b7d3b77f8cb9e0") },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",

        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "videos",
        let: {
          channelID: new mongoose.Types.ObjectId("69cfe01560b7d3b77f8cb9e0"),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$owner", "$$channelID"],
              },
            },
          },

          {
            $sort: {
              createdAt: -1,
              _id: -1,
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              "thumbnail.publicId": 0,
              "video.publicId": 0,
            },
          },
        ],
        as: "total_vedios",
      },
    },
    {
      $project: {
        "user.__v": 0,
        "user.password": 0,
        "user.refreshToken": 0,
        "user.role": 0,
        "user.isVerified": 0,
        "user.watchHistory": 0,
        "user.email": 0,
        "user.coverImg.publicId": 0,
        "user.avatar.publicId": 0,
        // "user.": 0,
        // "user.": 0,

        owner: 0,
        __v: 0,
        // "total_vedios.": 0,
      },
    },
  ]);
  // const data2 = await Channel.findOne({ owner: "69cfdfb560b7d3b77f8cb9d7" })
  console.log(JSON.stringify(channelProfile[0], null, 2));
  return channelProfile;
};

export const filterVideos = async (user, sortedBy, channelID) => {
  const sortedVideo = await Video.aggregate([
    {
      $match: {
        $and: [
          {
            _id: {
              $gt: new mongoose.Types.ObjectId("69d3278407bd3fec606577d8"),
            },
            createdAt: { $gt: new Date("2026-04-03T15:43:17.575Z") },
          },
          {
            createdAt: { $gt: new Date("2026-04-03T15:43:17.575Z") },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "channels",
        localField: "owner",
        foreignField: "_id",
        as: "owner_deatil",
      },
    },
    {
      $limit: 5,
    },
    {
      $sort: {
        _id: -1,
        createdAt: -1,
      },
    },
  ]);
  return sortedVideo;
};
