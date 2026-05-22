import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-Aggregate-paginate-v2";
const ScheduleSchema = mongoose.Schema({
  isSchduled: {
    type: Boolean,
    default: false,
  },
  publishAt: {
    type: Date,
    // required: [true, "seduled date is required"],
    default: Date.now,
  },
});

const Shadul = mongoose.model("Shadul", ScheduleSchema);

const mataDataSchema = new mongoose.Schema({
  duration: {
    type: Number,
  },
  aspectRatio: {
    type: String,
  },
  videoType: {
    type: String,
    enum: ["sort", "long"],
  },
  hight: {
    type: Number,
  },
  width: Number,
});

mataDataSchema.methods.checkType = function (aspectRatio, duration) {
  if (aspectRatio === "1920X1080" && duration <= 2000) {
    this.videoType = "sort";
  } else {
    this.videoType = "long";
  }
};
export const MetaData = mongoose.model("MetaData", mataDataSchema);

const VideoSchema = mongoose.Schema(
  {
    video: {
      publicId: {
        type: String,
        trim: true,
        required: [true, "video is required"],
      },
      url: {
        type: String,
        trim: true,
        required: [true, "video is required"],
      },
    },

    thumbnail: {
      publicId: {
        type: String,
        trim: true,
        required: [true, "thumbnail is required"],
      },
      url: {
        type: String,
        trim: true,
        required: [true, "thumbnail is required"],
      },
    },
    tittle: {
      type: String,
      required: [true, "video is required"],
      trim: true,
      maxlength: [100, "tittle is too long max 100 word"],
      minlength: [10, "tittle is too short min 10 word"],
    },
    decription: {
      type: String,
      required: [true, "video is required"],
      trim: true,
      maxlength: [3000, "decription is too long"],
    },
    tag: [
      {
        type: String,
        trim: true,
        maxlength: [3000, "decription is too long"],
        index: true,
      },
    ],
    hashtag: [
      {
        type: String,
        trim: true,
        maxlength: [3000, "decription is too long"],
        index: true,
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isPublish: {
      type: Boolean,
      default: true,
    },
    isMember: {
      type: Boolean,
      default: false,
    },
    Shaduling: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shadul",
    },
    metaData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MetaData",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    tagProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TagProduct",
      // required: true,
    },
    isChildren: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

VideoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", VideoSchema);
