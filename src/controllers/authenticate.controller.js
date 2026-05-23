import asyncHandler from "../utils/ansicHandler.js";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import successResponse from "../utils/successResponse.js";

const authenticte = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ErrorFormater("unathorised requested plz login", "", 401);
  }

  res.status(200).json(new successResponse(200, user, "user authenticated"));
});
export default authenticte;
