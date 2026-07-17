import jwt from "jsonwebtoken";
import { sendError } from "../utils/http.js";

export const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return sendError(res, 401, "Unauthorized");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 401, "Invalid or expired token");
    }

}


export default authUser;

