import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, default: true },
    video: { type: String, default: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Custom validation: Either image or video is required
postSchema.pre("validate", function (next) {
  if (!this.image && !this.video) {
    return next(new Error("Either image or video is required."));
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
