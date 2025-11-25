import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach to req object directly
        if (!req.body) req.body = {}; // Initialize body if undefined (for GET requests)
        req.body.userId = decoded.id; // Also attach to body for backward compatibility
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}


export default authUser;

