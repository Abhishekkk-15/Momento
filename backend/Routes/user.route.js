import express from"express";
import { editProfile, followOrUnFollow, getProfile, getSuggestedUsers, login, logout, register,searchUsers } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePicture'),editProfile);
router.route('/suggested').get(isAuthenticated,getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnFollow);
router.route('/search').get(isAuthenticated, searchUsers);

export default router;