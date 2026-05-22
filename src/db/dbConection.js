import mongoose from "mongoose";
import { DB_NAME } from "../constent.js";

async function dbconoction() {
  if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined in environment variables");
  }
  try {
    const responce = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${DB_NAME}`
    );
    return responce;
  } catch (error) {
    console.log("db error", error);
    process.exit(1);
  }
}
export default dbconoction;
