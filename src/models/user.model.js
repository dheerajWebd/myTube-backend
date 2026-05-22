import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { HASH_ROUND } from "../constent.js";
const tempTokenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  hashOtp: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires:"5m",
  },
});

export const TempToken = mongoose.model("TempToken", tempTokenSchema);

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "must be required ussername"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "must be required fullName"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "must be required email"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        "invalid email",
      ],
    },
    password: {
      type: String,
      required: [true, "must be required email"],
      trim: true,
      minlength: [6, "password is too sort"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "password is tooo week",
      ],
      select: false,
    },
    avatar: {
      publicId: {
        type: String,
        trim: true,
        required: [true, "avatar is required"],
      },
      url: {
        type: String,
        trim: true,
        required: [true, "avatar url is required"],
      },
    },
    coverImg: {
      publicId: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    role: {
      type: String,
      enum: ["user", "adimn"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    tempToken: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TempToken",
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// here is the encrypt or decrypt methods
userSchema.pre("save", async function (next) {
  // yaha pe jab async function use karate hai to next prommise mongoDB handeal karata hai to next nahi call karana chahiya quki next undefine hojata hai lekin jab async nhi use karate hai to next ko lagana chahiya
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, HASH_ROUND);
}); // always don't craeate the arrow function

userSchema.methods.isCompare = async function (password) {
  console.log(password);

  return await bcrypt.compare(password, this.password);
};

//  here is the reffres token's methods
userSchema.methods.accsesToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCSES_TOKEN,
    {
      expiresIn: process.env.EXP_ACC,
    }
  );
};
userSchema.methods.RefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFF_TOKEN,
    {
      expiresIn: process.env.EXP_REF,
    }
  );
};
userSchema.methods.verifyString = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.VERIFY_TOKEN,
    {
      expiresIn: process.env.EXP_VERI,
    }
  );
};
export const User = mongoose.model("User", userSchema);
