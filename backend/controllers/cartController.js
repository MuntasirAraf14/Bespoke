import userModel from "../models/userModel.js";

//add products to user cart
const addToCart = async (req, res) => {
    try {

        const { userId, productId, size } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData;

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

        res.json({ success: true, message: "Product added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//remove products from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId, size } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData;

        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] -= 1;
            } else {
                cartData[productId][size] = 1;
            }
        } else {
            cartData[productId] = {};
            cartData[productId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Product removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//get user cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, productId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] = quantity;
            } else {
                cartData[productId][size] = quantity;
            }
        } else {
            cartData[productId] = {};
            cartData[productId][size] = quantity;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Product updated in cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { addToCart, removeFromCart, getCart, updateCart }