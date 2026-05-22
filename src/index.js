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
app.listen(process.env.PORT || 4000, () => {
  console.log("server  is listen in 5000 port");
});
// channelProfile()
// app.get("/l", async (req, res) => {
//   const r = await filterVideos();

//   res.json(r);
// });

// const log = await User.find({
//   userName: "dheerajDwivedi087rgergregefgge",
// // });
// console.log(log);
// echo "# myTube" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/dheerajWebd/myTube.git
// git push -u origin main
//
