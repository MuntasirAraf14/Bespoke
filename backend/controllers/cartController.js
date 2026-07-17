import userModel from "../models/userModel.js";
import { sendError, sendSuccess } from "../utils/http.js";

const getUserCartData = async (userId, res) => {
    const userData = await userModel.findById(userId);

    if (!userData) {
        sendError(res, 404, "User not found");
        return null;
    }

    return userData.cartData || {};
};

//add products to user cart
const addToCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.userId;

        if (!productId || !size) {
            return sendError(res, 400, "Product ID and size are required");
        }

        const cartData = await getUserCartData(userId, res);
        if (!cartData) return;

        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] += 1;
            } else {
                cartData[productId][size] = 1;
            }
        } else {
            cartData[productId] = {};
            cartData[productId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });

        sendSuccess(res, { message: "Product added to cart" });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

//remove products from user cart
const removeFromCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.userId;

        if (!productId || !size) {
            return sendError(res, 400, "Product ID and size are required");
        }

        const cartData = await getUserCartData(userId, res);
        if (!cartData) return;

        if (cartData[productId]?.[size]) {
            cartData[productId][size] -= 1;

            if (cartData[productId][size] <= 0) {
                delete cartData[productId][size];
            }

            if (Object.keys(cartData[productId]).length === 0) {
                delete cartData[productId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        sendSuccess(res, { message: "Product removed from cart" });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

//get user cart
const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartData = await getUserCartData(userId, res);
        if (!cartData) return;

        sendSuccess(res, { cartData });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

//update user cart
const updateCart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.userId;
        const parsedQuantity = Number(quantity);

        if (!productId || !size || !Number.isFinite(parsedQuantity)) {
            return sendError(res, 400, "Product ID, size, and valid quantity are required");
        }

        const cartData = await getUserCartData(userId, res);
        if (!cartData) return;

        if (parsedQuantity <= 0) {
            if (cartData[productId]) {
                delete cartData[productId][size];

                if (Object.keys(cartData[productId]).length === 0) {
                    delete cartData[productId];
                }
            }
        } else {
            if (!cartData[productId]) {
                cartData[productId] = {};
            }
            cartData[productId][size] = parsedQuantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        sendSuccess(res, { message: "Product updated in cart" });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}


export { addToCart, removeFromCart, getCart, updateCart }
