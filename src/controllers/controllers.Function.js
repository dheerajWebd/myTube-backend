import { ErrorFormater } from "../utils/ErrorFormate.js";
import crypto, { randomBytes } from "crypto";
export const genaretTokensForAuth = async user => {
  try {
    const genaretaccsesToken = user.accsesToken();
    const genaretRefreshToken = user.RefreshToken();

    user.refreshToken = genaretRefreshToken;
    user.isVerified = true;

    await user.save({ validateBeforeSave: false });

    return {
      genaretaccsesToken,
      genaretRefreshToken,
      Verified: user.isVerified,
    };
  } catch (error) {
    console.log(error);
    throw new ErrorFormater(
      "somthing went wrong while genareting tokens",
      [""],
      500
    );
  }
};

export const otpGenreter = () => {
  const otp = crypto.randomInt(100000, 999999);
  const hash = crypto.createHash("sha256").update(otp.toString()).digest("hex");
  return {
    otp,
    hash,
  };
};

export const verifyTockenGenreter = async () => {
  const token = await randomBytes(32).toString("hex");
  return token;
};
