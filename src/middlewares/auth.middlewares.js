import jwt from "jsonwebtoken";
import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import { User } from "../models/user.model.js";

export const authMiddileware = asyncHandler(async (req, _, next) => {
  try {
    const accsesToken =
      req.cookies?.accsesToken ||
      req.header("authorization")?.replace("Bearer ", "") ||
      req.query.at?.replace("Bearer ", "") ||
      req.body.at?.replace("Bearer ", "");

    if (!accsesToken)
      throw new ErrorFormater(
        "anauthorization request accses tocken is not available  mc",
        [""],
        401
      );
    const verifyUser = await jwt.verify(accsesToken, process.env.ACCSES_TOKEN);

    if (!verifyUser) {
      throw new ErrorFormater(
        "anauthorization request accses tocken is not match   mc",
        [""],
        401
      );
    }
    const deatileUser = await User.findById(verifyUser?._id).select(
      "-refreshToken -password"
    );
    const user = {
      ...deatileUser._doc,
      accsesToken,
    };
     

    if (!user || !user.isVerified) {
      throw new ErrorFormater(
        "anauthorization request accses tocken is not match ye kay bak raha be user to hai hi nahi mc",
        [""],
        401
      );
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ErrorFormater(error?.message || "invalide accses", [""], 401);
  }
});
