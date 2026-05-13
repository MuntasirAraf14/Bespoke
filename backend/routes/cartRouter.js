import express from "express";
import {addToCart, removeFromCart, getCart, updateCart} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";
import dbReady from "../middleware/dbReady.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, dbReady, addToCart);
cartRouter.post("/remove", authUser, dbReady, removeFromCart);
cartRouter.get("/get", authUser, dbReady, getCart);
cartRouter.post("/update", authUser, dbReady, updateCart);

export default cartRouter;
