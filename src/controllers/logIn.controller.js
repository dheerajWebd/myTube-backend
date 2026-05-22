import { Option } from "../constent.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";
import { genaretTokensForAuth } from "./controllers.Function.js";

export const logInUser = asyncHandler(async (req, res, next) => {
  const { email, userName, password } = req.body;

  if (!(userName || email) || !password)
    throw new ErrorFormater(
      "email or pasword and userName is required ",
      [""],
      401
    );

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  }).select("+password +refreshToken");
  console.log(user);

  if (!user) throw new ErrorFormater("user is not register", [""], 404);
  const c = await user.isCompare(password);
  if (!c) throw new ErrorFormater("wrong password plz tray agan ", [""], 303);

  const { genaretaccsesToken, genaretRefreshToken, Verified } =
    await genaretTokensForAuth(user);

  res
    .status(200)
    .cookie("accsesToken", genaretaccsesToken, Option)
    .cookie("refreshToken", genaretRefreshToken, Option)
    .cookie("Verified", Verified, Option)
    .json(
      new successResponse(
        200,
        {
          accsesToken: genaretaccsesToken,
          RefreshToken: genaretRefreshToken,
          Verified,
        },
        "logedIn "
      )
    );
});
