import { Option } from "../constent.js";
import { TempToken, User } from "../models/user.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import uplodOnCloudinary from "../utils/cloudinary.js";
import { emailSend } from "../utils/email.utils.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";
import { varificationEmail } from "../utils/tamplatesEmail/varification.email.js";
import { welcomeEmail } from "../utils/tamplatesEmail/wellcom.email.js";
import {
  genaretTokensForAuth,
  otpGenreter,
  verifyTockenGenreter,
} from "./controllers.Function.js";
import crypto from "crypto";



export const register = asyncHandler(async (req, res, next) => {
  const { role, password, email, fullName, userName } = req.body;

  if (
    [password, email, fullName, userName].some(
      filld => !filld || filld?.trim() === false
    )
  )
    throw new ErrorFormater(
      "required all fields",
      ["user is exsist you can try another email or user name "],
      409
    );

  const exsistedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (exsistedUser)
    throw new ErrorFormater(
      "user is exsist you can try another email or username ",
      ["user is exsist you can try another email or username "],
      400
    );
  const { avatar, coverImg } = req.files;

  if (!avatar)
    throw new ErrorFormater(
      "avata image is not found plz reuplode",
      ["user is exsist you can try another email or username "],
      402
    );

  const avatarPath = avatar[0]?.path;
  let coverImgpath;
  if (coverImg) {
    coverImgpath = coverImg[0]?.path;
  }

  if (!avatarPath)
    throw new ErrorFormater(
      "avata image path is not found plz reuplode",
      ["user is exsist you can try another email or username "],
      402
    );

  const resAvatarUplode = await uplodOnCloudinary(
    avatarPath,
    "/avatar/",
    "uaer_avatar"
  );

  const resCoverImgpath = await uplodOnCloudinary(
    coverImgpath || "",
    "/coverImg/",
    "uaer_cover"
  );

  if (!resAvatarUplode)
    throw new ErrorFormater(
      "avata image is not uploded somthings went wrong plz reuplode",
      ["user is exsist you can try another email or username"],
      500
    );

  const userCreated = await User.create({
    role: role || "user",
    coverImg: {
      publicId: resCoverImgpath?.public_id || "",
      url: resCoverImgpath?.url || "",
    },
    avatar: {
      publicId: resAvatarUplode?.public_id || "",
      url: resAvatarUplode?.url || "",
    },
    password,
    email,
    fullName,
    userName,
  });

  /**
   * @description genaret accses and refresh token for user directly after register login
   */

  const { genaretaccsesToken, genaretRefreshToken, Verified } =
    await genaretTokensForAuth(userCreated);

  emailSend(
    "dwivedidheeraj087@gmail.com",
    userCreated.email,
    "Confirm Your Email Address",
    welcomeEmail(userCreated.fullName)
  );

  res
    .status(201)
    .cookie("accsesToken", genaretaccsesToken, Option)
    .cookie("refreshToken", genaretRefreshToken, Option)
    .cookie("Verified", Verified, Option)
    .json(
      new successResponse(
        201,
        {
          coverImg: userCreated.coverImg || "",
          avatar: userCreated.avatar || "",
          email: userCreated.email || "",
          fullName: userCreated.fullName || "",
          userName: userCreated.userName || "",
          loged_in_deatials: {
            accsesToken: genaretaccsesToken,
            RefreshToken: genaretRefreshToken,
            Verified,
          },
        },
        "user created successfully or auto loged in "
      )
    );
});

export const varificationEmailAndSendToken = asyncHandler(
  async (req, res, next) => {
    const user = req?.user;

    if (!user)
      throw new ErrorFormater("unathorised requested plz login", "", 401);

    const userToccken = await TempToken.findOneAndDelete({
      userId: user._id,
    });
     
    const otpdata = otpGenreter();
    const token = await verifyTockenGenreter();

    const tempToken = await TempToken.create({
      _id: user._id,
      token: token,
      hashOtp: otpdata.hash,
      userId: user._id,
    });


    let useremail = user.email;

    let splitemail = useremail.split("@");

    const sequeremail =
      splitemail[0].substring(0, 4) + "*****@" + splitemail[1];

    const userUpdated = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          tempToken: tempToken._id,
        },
      },
      {
        new: true,
        validateDeforeSave: false,
      }
    );

    const send = emailSend(
      "dwivedidheeraj087@gmail.com",
      user.email,
      "Confirm Your Email Address",
      varificationEmail("dwivedi", otpdata.otp, token, user.accsesToken)
    );

    if (!send) throw new ErrorFormater("server error to send email", "", 500);

    res
      .status(200)
      .cookie("emailAccsesToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: 1000 * 5 * 60,
        maxAge: 5 * 60 * 1000,
        path: "/user/api/v1/user/verify",
      })
      .json(
        new successResponse(
          200,
          {
            useremail,
            sequeremail,
            userid: user._id,
            user,
          },
          "check your to send varification code on email for varification expire in 5 min"
        )
      );
  }
);

export const varificationemailWithOtp = asyncHandler(async (req, res, next) => {
  const { otp, accsessTocken } = req.query;
  if (!otp || !accsessTocken)
    throw new ErrorFormater("otp and accsessTocken are required", "", 400);

  const user = req?.user;
  if (!user)
    throw new ErrorFormater("unathorised requested plz login", "", 401);

  const userTocken = await TempToken.findOne({
    userId: user._id,
  });

  if (!userTocken)
    throw new ErrorFormater("unathorised requested plz login", "", 401);

  const hashOtp = userTocken.hashOtp;
  const token = userTocken.token;

  if (
    hashOtp !== crypto.createHash("sha256").update(otp).digest("hex") &&
    token !== accsessTocken
  )
    throw new ErrorFormater("otp or accsessTocken is invalid", "", 400);

  const userUpdated = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        emailVarified: true,
        tempToken: null,
      },
    },
    {
      new: true,
      validateDeforeSave: false,
    }
  );
  await TempToken.deleteOne({ userId: user._id });
  res.status(200).clearCookie("emailAccsesToken").redirect("/?verify=true");
});
