import mongoose from "mongoose";
import { DB_NAME } from "../constent.js";

async function dbconoction() {
  if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined in environment variables");
  }
  try {
    const responce = await mongoose.connect(
      `${"mongodb://localhost:27017"}/${DB_NAME}`
    );
console.log( `${"mongodb://localhost:27017"}/${DB_NAME}`)
    console.log("mongoDB is connected \n");
    return responce;
  } catch (error) {
    console.log("db error", error);
    process.exit(1);
  }
}
export default dbconoction;
