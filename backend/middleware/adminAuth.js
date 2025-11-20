import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // FIX: Check if the token belongs to the hardcoded admin email
        if (token_decode.email === process.env.ADMIN_EMAIL) {
            next(); // Allow access immediately
            return;
        }

        // If not hardcoded admin, check database (optional, if you have other admin roles)
        if (token_decode.id) {
             const user = await userModel.findById(token_decode.id);
             if (user && user.role === 'admin') {
                 next();
                 return;
             }
        }

        return res.json({ success: false, message: "Not Authorized Login Again" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;