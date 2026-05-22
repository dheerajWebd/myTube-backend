import express from "express";
import { authMiddileware } from "../middlewares/auth.middlewares.js";
import { subsacriptionController } from "../controllers/subsacription.controller.js";
const subscriptionRouter = express.Router();

subscriptionRouter
  .route("/subscribe/:channelId")
  .post(authMiddileware, subsacriptionController);
export default subscriptionRouter;
