import { User } from "../models/user.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import uplodOnCloudinary from "../utils/cloudinary.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";

export const updatepassword = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isCompare = await user.isCompare(currentPassword);
  if (!isCompare)
    throw new ErrorFormater("current password is wrong ", "", 404);

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .send("password updated successfully")
    .redirect("/user/profile");
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const { fullName } = req.body;
    const { coverImg, avatar } = req.files;
    const user = await User.findById(req.user._id);

    const updateData = {};
    let uplodeCoverImg, uplodeAvatar;

    if (coverImg) {
      uplodeCoverImg = coverImg[0].path;
      let coverimageUrl = await uplodOnCloudinary(
        uplodeCoverImg || "",
        "/coverImg/",
        "uaer_cover"
      );
      updateData.coverImg = {
        publicId: coverimageUrl?.public_id || user.coverImg.public_id,
        url: coverimageUrl?.url || user.coverImg.url,
      };
    }

    if (avatar) {
      uplodeAvatar = avatar[0].path;
      let avatarUrl = await uplodOnCloudinary(
        uplodeAvatar || "",
        "/avatar/",
        "uaer_avatar"
      );

      updateData.avatar = {
        publicId: avatarUrl?.public_id || user.avatar.public_id,
        url: avatarUrl?.url || user.avatar.url,
      };
    }

    if (fullName) {
      updateData.fullName = fullName;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json(
        new successResponse(200, updatedUser, "profile update successfully")
      )
      .redirect("/user/profile");
  } catch (error) {
    throw new ErrorFormater("failed to update profile", [error.message], 500);
    console.log(error);
  }
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  // fristly disable the account then delete after 7days if user desont want to reactivate the account within the 7days then delete the account permantly
  const { password, userName, confirmUsername } = req.body;
  if (userName !== confirmUsername)
    throw new ErrorFormater(
      "to delete your account deos't match username or confirm username ",
      "",
      400
    );
  const user = await User.findById(req.user._id).select("+password");
});
