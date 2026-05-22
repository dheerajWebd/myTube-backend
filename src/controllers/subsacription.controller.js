import asyncHandler from "../utils/ansicHandler.js";
import { subscription } from "../models/subscripton.model.js";
import { Channel } from "../models/channel.model.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
export const subsacriptionController = asyncHandler(async (req, res, next) => {
  const user = await subscription.findOne({
    userId: req.user._id,
    channelId: req.params.channelId,
  });
  console.log(user);
  const selfChannel = await Channel.findOne({ owner: req.user._id });

  if (selfChannel)
    throw ErrorFormater("you can't subscribe to your own channel", "", 400);

  const channelIds = req.params.channelId;
  if (user) {
    console.log(channelIds);
    await user.deleteOne({ channelId: channelIds });
    await Channel.updateOne(
      { _id: channelIds },
      {
        $get: { subCount: 0 },
        $inc: { subCount: -1 },
      }
    );
    return res.json({ status: 201, message: "unsubscribed successfully" });
  }
  await Channel.updateOne(
    { _id: channelIds },
    {
      $inc: { subCount: 1 },
    }
  );
  const newSubscriber = await subscription.create({
    userId: req.user._id,
    channelId: channelIds,
  });
  res.json({
    status: 201,
    data: newSubscriber,
    message: "subscribed successfully",
  });
});

