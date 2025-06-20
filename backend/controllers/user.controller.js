import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

//register logic
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Somthing is missing, Please check!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Existing account, use new details!",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
//Login logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Somthing is missing, Please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //populate each post if in the post array
    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
        token,
      });
  } catch (error) {
    console.log(error);
  }
};

//logout
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks');
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    if (bio!==undefined) user.bio = bio;
    if (gender !==undefined && gender !=='undefined') {user.gender = gender};
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile Updated.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

//suggestion of users
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password" );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users.",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

//follow and unfollow
export const followOrUnFollow = async (req, res) => {
  try {
    const followkrnewala = req.id;
    const followkrunga = req.params.id;
    if (followkrunga === followkrnewala) {
      return res.status(400).json({
        message: "you cannot follow/Unfollow Yourself",
        success: false,
      });
    }

    const user = await User.findById(followkrnewala);
    const targetUser = await User.findById(followkrunga);
    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // check follow krna hai unfollow
    const isFollowing = user.following.includes(followkrunga);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followkrnewala },
          { $pull: { following: followkrunga } }
        ),
        User.updateOne(
          { _id: followkrunga },
          { $pull: { followers: followkrnewala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "UnFollowed Successfully", success: true });
    } else {
      //      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: followkrnewala },
          { $push: { following: followkrunga } }
        ),
        User.updateOne(
          { _id: followkrunga },
          { $push: { followers: followkrnewala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed Successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

// search users
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.username;
    if (!query) {
      return res.status(400).json({ message: "Query is missing", success: false });

    }

    res.set("Cache-Control", "no-store");

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("-password");

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

