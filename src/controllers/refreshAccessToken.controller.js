import jwt from "jsonwebtoken";
import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";
import { genaretTokensForAuth } from "./controllers.Function.js";
import { User } from "../models/user.model.js";
import { Option } from "../constent.js";

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const tocken = req.cookies?.refreshToken;

    if (!tocken) {
      throw new ErrorFormater("Refresh token missing", [], 401);
    }
    const verifyUser = await jwt.verify(tocken, process.env.REFF_TOKEN);

    if (!verifyUser) {
      throw new ErrorFormater(
        "anauthorization request accses tocken is not match plz or user log in again mc",
        [""],
        401
      );
    }
    const user = await User.findById(verifyUser._id).select("+refreshToken");

    if (!user) {
      throw new ErrorFormater(
        "anauthorization request accses tocken is not match or user is not found plz log in again ",
        [""],
        401
      );
    }

    console.log(user);

    if (user.refreshToken !== tocken) {
      console.log("mismatch \n", tocken);
      throw new ErrorFormater("mismatch the tocken ", [], 500);
    }

    const tockens = await genaretTokensForAuth(user);

    if (!tockens)
      throw new ErrorFormater(
        "somthing went wrong when genaretig the new tokens ",
        [],
        500
      );
    res
      .cookie("accsesToken", tockens.genaretaccsesToken, Option)
      .cookie("refreshToken", tockens.genaretRefreshToken, Option)
      .cookie("Verified", tockens.isVerified, Option)
      .json(new successResponse(200, tockens));
  } catch (error) {
    console.log(error);
    throw new ErrorFormater(
      error.massage || "somthing went wrong when genaretig the new tokens ",
      [],
      500
    );
  }
});
