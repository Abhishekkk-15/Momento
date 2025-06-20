import Story from "../models/story.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Create a story (Image/Video)

export const createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("User:", req.user);  


    const fileUri = getDataUri(req.file);
    // const result = await cloudinary.uploader.upload(fileUri.content, {
    // const result = await cloudinary.uploader.upload(fileUri.content, {
    //   resource_type: "auto",
    //   folder: "stories",
    // });
    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
      folder: "stories",
    });

    const story = await Story.create({
      userId: req.user._id,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Failed to upload story" });
  }
};

// ─────────────────────────────────────────────
// Get all stories
// ─────────────────────────────────────────────
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};

// ─────────────────────────────────────────────
// Mark story viewed
// ─────────────────────────────────────────────
export const markStoryViewed = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.viewers.includes(req.user._id)) {
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.status(200).json({ message: "Marked as viewed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark story viewed" });
  }
};

// ─────────────────────────────────────────────
// Get viewers of a story
// ─────────────────────────────────────────────
export const getStoryViewers = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate(
      "viewers",
      "username profilePicture"
    );
    if (!story) return res.status(404).json({ message: "Story not found" });

    res.json(story.viewers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get viewers" });
  }
};

// ─────────────────────────────────────────────
// Delete a story
// ─────────────────────────────────────────────
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.cloudinaryId) {
      await cloudinary.v2.uploader.destroy(story.cloudinaryId, {
        resource_type: "auto",
      });
    }

    await story.deleteOne();
    res.status(200).json({ message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete story" });
  }
};

// ─────────────────────────────────────────────
// Repost story
// ─────────────────────────────────────────────
export const repostStory = async (req, res) => {
  try {
    const original = await Story.findById(req.params.id);
    if (!original) return res.status(404).json({ message: "Story not found" });

    const newStory = await Story.create({
      userId: req.user._id,
      imageUrl: original.imageUrl,
      cloudinaryId: original.cloudinaryId,
    });

    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: "Failed to repost story" });
  }
};
