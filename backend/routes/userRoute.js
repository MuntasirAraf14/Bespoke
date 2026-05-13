import express from "express";
import { loginUser, registerUser, adminLogin, googleLogin, getProfile, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/google', googleLogin);

userRouter.post('/admin', adminLogin);

// Profile Routes
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, upload.single('image'), updateProfile);

export default userRouter;
