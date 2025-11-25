import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// Helper function to create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

// Route for login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // checking exist user or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        //validating email and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password is not strong enough" });
        }
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //creating new user
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3d' });
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "You are not authorized to access this" });
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}

// Route for Google login
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await userModel.findOne({ email });

        if (!user) {
            // Create new user with random password since they are logging in via Google
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new userModel({
                name,
                email,
                password: hashedPassword
            });
            await user.save();
        }

        const jwtToken = createToken(user._id);
        res.json({ success: true, token: jwtToken });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



// Get User Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId; // Check both
        console.log('getProfile - userId:', userId);
        console.log('getProfile - req.userId:', req.userId);
        console.log('getProfile - req.body.userId:', req.body.userId);
        
        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }
        
        const user = await userModel.findById(userId).select('-password');
        console.log('getProfile - user found:', user);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.log('getProfile - error:', error);
        res.json({ success: false, message: error.message });
    }
}

// Update User Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { phone, address } = req.body;
        const user = await userModel.findByIdAndUpdate(userId, { phone, address }, { new: true }).select('-password');
        res.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, googleLogin, getProfile, updateProfile };
