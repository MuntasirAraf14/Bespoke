import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import fs from 'fs';
import { sendError, sendSuccess } from '../utils/http.js';

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, bestSeller } = req.body;

        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return sendError(res, 400, "Name, description, price, category, subCategory, and sizes are required");
        }

        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return sendError(res, 400, "Price must be a positive number");
        }

        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
        } catch {
            return sendError(res, 400, "Sizes must be a valid JSON array");
        }

        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
            return sendError(res, 400, "At least one size is required");
        }

        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return sendError(res, 400, "At least one product image is required");
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                fs.unlink(item.path, (err) => {
                    if (err) console.error(`Failed to delete local file: ${item.path}`, err);
                });
                return result.secure_url;
            })
        );

        const isBestseller = (bestseller === "true" || bestSeller === "true") ? true : false;

        const productData = {
            name,
            description,
            category,
            price: parsedPrice,
            subCategory,
            bestseller: isBestseller,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        sendSuccess(res, { message: "Product Added" });

    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
        const skip = (page - 1) * limit;

        const products = await productModel.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await productModel.countDocuments();

        sendSuccess(res, { 
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
        });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return sendError(res, 400, "Product ID missing");
        }

        const product = await productModel.findByIdAndDelete(productId);

        if (!product) {
            return sendError(res, 404, "Product not found");
        }

        sendSuccess(res, { message: "Product removed successfully" });

    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
};


// function for single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return sendError(res, 400, "Product ID missing");
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return sendError(res, 404, "Product not found");
        }

        sendSuccess(res, { product });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

export { listProducts, addProduct, removeProduct, singleProduct };
