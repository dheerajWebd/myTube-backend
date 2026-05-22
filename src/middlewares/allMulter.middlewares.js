import multer from "multer";
import { ErrorFormater } from "../utils/ErrorFormate.js";
import { upload } from "./multer.middlewares.js";

const allMulter = (filter = "") => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, ".public/temp");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname + "-" + Date.now() + Math.round(Math.random() * 1e9)
      );
      console.log(file.fieldname);
    },
  });
  const fileFilter = (req, file, cb) => {
    const filtered = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      filter,
      "video/mp4",
      "video/mov",
    ];
    if (filtered.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ErrorFormater(
          "only image or file are allowed",
          "only image or file are allowed",
          403
        ),
        false
      );
    }
  };
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 100 * 1024 * 10224,
    },
  });
  return upload;
};
export default allMulter;
