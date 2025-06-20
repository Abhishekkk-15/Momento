import express from 'express';
import {
  createStory,
  getStories,
  markStoryViewed,
  getStoryViewers,
  deleteStory,
  repostStory
} from '../controllers/story.controller.js';
import { protect } from "../middlewares/authMiddleware.js"
import upload from "../middlewares/multer.js"; 


const router = express.Router();

router.post('/', protect, upload.single("file"), createStory);  // Upload story
router.get('/', protect, getStories);   // Get all stories

router.put('/view/:id', protect, markStoryViewed); // Mark as viewed
router.get('/viewers/:id', protect, getStoryViewers); // Get story viewers
router.post('/repost/:id', protect, repostStory);
router.delete('/:id', protect, deleteStory); // Delete story

export default router;
