import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Types } from "mongoose";
import streamifier from "streamifier";
import { getRecieverSocketId, io } from "../socket/socket.js";

// export const addNewPost = async (req, res) => {
//   try {
//     const { caption } = req.body;
//     const image = req.file;
//     const authorId = req.id;

//     if (!image) return res.status(400).json({ message: "Image required" });
//     //image upload
//     const optimizedImageBuffer = await sharp(image.buffer)
//       .resize({ width: 800, height: 800, fit: "inside" })
//       .toFormat("jpeg", { quality: 80 })
//       .toBuffer();

//     //buffer to dat auri
//     const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
//       "base64"
//     )}`;
//     const cloudResponse = await cloudinary.uploader.upload(fileUri);
//     const post = await Post.create({
//       caption,
//       image: cloudResponse.secure_url,
//       author: authorId,
//     });

//     const user = await User.findById(authorId);
//     if (user) {
//       user.posts.push(post._id);
//       await user.save();
//     }

//     await post.populate({ path: "author", select: "-password" });

//     return res.status(201).json({
//       message: "New post added",
//       post,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// 

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    const authorId = req.id;

    if (!file) {
      return res.status(400).json({ message: "Image or video is required" });
    }

    let imageUrl = null;
    let videoUrl = null;

    if (file.mimetype.startsWith("image/")) {
      // Image upload logic
      const optimizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imageUrl = cloudResponse.secure_url;
    } else if (file.mimetype.startsWith("video/")) {
      // ✅ Fix: Await the upload_stream using a Promise
      const uploadVideo = () =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "video" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

      const result = await uploadVideo();
      videoUrl = result.secure_url;
    }

    const post = await Post.create({
      caption,
      image: imageUrl,
      video: videoUrl,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};



//get all post
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      //     console.log(posts)
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//author posts
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
      .populate({path : "bookmarks", select:"_id"});
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//like logic
export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "Post not Found",
        success: false,
      });

    //like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    //implement of socket io for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId!== likeKrneWalaUserKiId){
          const notification = {
            type:'like',
            userId:likeKrneWalaUserKiId,
            userDetails:user,
            postId,
            message:"Your post was liked"
          }
          const postOwnerSocketId = getRecieverSocketId(postOwnerId);
          io.to(postOwnerSocketId).emit('notification', notification);
        }
    return res.status(200).json({
      message: "post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Dislike post
export const disLikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "Post not Found",
        success: false,
      });

    //dislike logic started
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    //     //implement of socket io for real time notification
       const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId!== likeKrneWalaUserKiId){
          const notification = {
            type:'dislike',
            userId:likeKrneWalaUserKiId,
            userDetails:user,
            postId,
            message:"Your post was liked"
          }
          const postOwnerSocketId = getRecieverSocketId(postOwnerId);
          io.to(postOwnerSocketId).emit('notification', notification);
        }

    return res.status(200).json({
      message: "post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//add comment
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentkreneWalaUserkiId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text) {
      return res.status(404).json({
        message: "text is required",
        success: false,
      });
    }
    const comment = await Comment.create({
      text,
      author: commentkreneWalaUserkiId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id); 

    await post.save();
    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//comment according to there post
export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments)
      return res.status(404).json({
        message: "No comment found for this post",
        success: false,
      });
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

//to delete comment
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    //check if the logged in user is the owner of post
    if (post.author.toString() != authorId)
      return res.status(403).json({ message: "Unauthorized" });

    //delete post
    await Post.findByIdAndDelete(postId);

    //remove the post id from the user post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() != postId);
    await user.save();

    //delete associated comments
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      message: "Post Deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Bookmark
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //already bookmarked
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
        bookmarks: user.bookmarks,
      });
    } else {
      //bookmark
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post saved to bookmark",
        success: true,
        bookmarks: user.bookmarks,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
