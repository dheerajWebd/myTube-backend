import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const tempDir = path.join("public", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const uplodOnCloudinary = async (localFileUrl, folderName, publicId) => {
  if (!localFileUrl) return null;
  try {
    const responce = await cloudinary.uploader.upload(localFileUrl, {
      folderName: folderName,
      public_id: publicId,
      resource_type: "auto",
    });

    fs.unlink(localFileUrl, err => {});

    return responce;
  } catch (error) {
    fs.unlink(localFileUrl, err => {});
    return null;
  }
};

export default uplodOnCloudinary;
