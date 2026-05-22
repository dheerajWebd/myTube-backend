import express from "express";
import { authMiddileware } from "../middlewares/auth.middlewares.js";
import { postCommentController } from "../controllers/postComment.controller.js";
import {
  deletepostController,
  editpostController,
  getpostController,
  postController,
} from "../controllers/post.controller.js";
import { chatGPTController } from "../api/chatgpt.api.js";

const postRouter = express.Router();
postRouter.use(authMiddileware);
postRouter
  .route("/createpost")
  .post(postController)
  .put(editpostController)
  .delete(deletepostController)
  .get(getpostController);

postRouter.route("/postcomment").post(postCommentController);
postRouter.route("/chatgpt").get(chatGPTController);
// .put(editcommentController)
// .delete(deletedcommentController);

export default postRouter;
