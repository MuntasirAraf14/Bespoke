import express from "express";
import {addToCart, removeFromCart, getCart, updateCart} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/remove", authUser, removeFromCart);
cartRouter.get("/get", authUser, getCart);
cartRouter.post("/update", authUser, updateCart);

export default cartRouter;