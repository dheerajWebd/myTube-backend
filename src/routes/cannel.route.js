import express from "express";
import { authMiddileware } from "../middlewares/auth.middlewares.js";
import { channelController } from "../controllers/channel.controller.js";
import allMulter from "../middlewares/allMulter.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

export const channelRoute = express.Router();
// proteted route
channelRoute.use(authMiddileware);
channelRoute
  .route("/create_channel")
  .post(upload.single("coverImg"), channelController);
