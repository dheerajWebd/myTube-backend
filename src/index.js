import { app } from "./app.js";
import "dotenv/config";
import dbconoction from "./db/dbConection.js";
import { filterVideos } from "./controllers/getUser.controller.js";
import { CommentController } from "./controllers/comment.controller.js";
import { likeControll } from "./controllers/likeVideo.controller.js";
import { User } from "./models/user.model.js";

dbconoction();

app.use((err, _, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.message || [],
    statusCode: err.statusCode || 500,
  });
  next(err);
});
app.listen(process.env.PORT || 4000, () => {});
