import { Option } from "../constent.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import successResponse from "../utils/successResponse.js";

export const logOutUser = asyncHandler(async (req, res, _) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        refreshToken: undefined,
        isVerified: false,
      },
    },
    {
      new: true,
    }
  );


  res
    .status(200)
    .clearCookie("accsesToken", Option)
    .clearCookie("refreshToken", Option)
    .clearCookie("Verified", Option)
    .json(
      new successResponse(200, { Verified: updatedUser?.isVerified }, "logedOut ")
    );
});
