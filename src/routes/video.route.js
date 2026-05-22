import express from "express";
import { authMiddileware } from "../middlewares/auth.middlewares.js";
import {
  deleteVideo,
  editThumbnail,
  editVideos,
  videoControll,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  CommentController,
  deletedcommentController,
  editcommentController,
  heartByOwnercommentController,
} from "../controllers/comment.controller.js";
import {
  addsaveVideoController,
  deletesavevideoController,
  editsaveVideoController,
  saveVideoController,
} from "../controllers/savevideo.controller.js";
import {
  addVideoPlaylistController,
  deletePlaylistController,
  editPlaylistController,
  PlaylistController,
} from "../controllers/playlist.controller.js";

const videoRouter = express.Router();
videoRouter.use(authMiddileware);

videoRouter
  .route("/video/uplode/:_id")
  .post(
    upload.fields([
      { name: "video", maxcount: 1 },
      { name: "thumbnail", maxcount: 1 },
    ]),
    videoControll
  )
  .put(editVideos)
  .delete(deleteVideo);

videoRouter
  .route("/video/edit_thumbnail")
  .put(upload.single("thumbnail"), editThumbnail);

videoRouter
  .route("/video/comment")
  .post(CommentController)
  .put(editcommentController)
  .delete(deletedcommentController);

videoRouter.route("/video/comment/heart").post(heartByOwnercommentController);

videoRouter
  .route("/video/save_video")
  .post(saveVideoController)
  .put(editsaveVideoController)
  .delete(deletesavevideoController);
videoRouter.route("/video/save/addvideo").post(addsaveVideoController);

videoRouter
  .route("/video/playlists")
  .post(PlaylistController)
  .put(editPlaylistController)
  .delete(deletePlaylistController);
videoRouter.route("/video/playlist/addvideo").post(addVideoPlaylistController);

export default videoRouter;
