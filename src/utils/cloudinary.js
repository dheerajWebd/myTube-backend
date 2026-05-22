import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uplodOnCloudinary = async (localFileUrl, folderName, publicId) => {
  console.log(localFileUrl);
  if (!localFileUrl) return null;
  try {
    const responce = await cloudinary.uploader.upload(localFileUrl, {
      folderName: folderName,
      public_id: publicId,
      resource_type: "auto",
    });

    fs.unlink(localFileUrl, err => {
      console.log(err);
    });

    return responce;
  } catch (error) {
    console.log(error);
    fs.unlink(localFileUrl, err => {
      console.log(err);
    });
    return null;
  }
};

export default uplodOnCloudinary;
