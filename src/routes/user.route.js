import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  register,
  varificationEmailAndSendToken,
  varificationemailWithOtp,
} from "../controllers/register.controller.js";
import { logInUser } from "../controllers/logIn.controller.js";
import { authMiddileware } from "../middlewares/auth.middlewares.js";
import { logOutUser } from "../controllers/logOut.controller.js";
import { channelProfile } from "../controllers/getUser.controller.js";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
import {
  updatepassword,
  updateProfile,
} from "../controllers/UserCURDopertions.controller.js";
import { likeControll } from "../controllers/likeVideo.controller.js";
import { chatGPTController } from "../api/chatgpt.api.js";
import { User } from "../models/user.model.js";
const UserRoute = express.Router();

UserRoute.route("/register").post(
  upload.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  register
);

UserRoute.route("/login").post(logInUser);

// proteted route
UserRoute.route("/logOut").post(authMiddileware, logOutUser);
UserRoute.route("/refresh/token").post(refreshAccessToken);
UserRoute.route("/change/password").put(authMiddileware, updatepassword);
UserRoute.route("/change/profile").put(
  authMiddileware,
  upload.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  updateProfile
);
UserRoute.route("/channelProfile").get(authMiddileware, channelProfile);
UserRoute.route("/like").post(authMiddileware, likeControll);
UserRoute.route("/chatgpt").get(chatGPTController);
UserRoute.route("/verifiy").put(
  async (req, res, next) => {
    try {
      const { email, userName } = req.body;
      const forgetRout = await User.findOne({
        $or: [{ email }, { userName }],
      });
      if (!forgetRout) {
        next();
      }
      req.forgetRout = forgetRout;
      next();
    } catch (error) {
      next();
    }
  },
  async (req, res, next) => {
    if (req.forgetRout) {
      console.log(req.forgetRout);
      next();
    }
    return authMiddileware;
  },
  varificationEmailAndSendToken
);
UserRoute.route("/email/verify/").get(
  authMiddileware,
  varificationemailWithOtp
);

export default UserRoute;
