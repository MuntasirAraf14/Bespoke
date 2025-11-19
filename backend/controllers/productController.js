
import productModel from '../models/productModel.js'; 

//function for add product
const addProduct = async (req, res) => {
    try {
        // 1. Extract data from the request body
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // 2. Extract image information from the request files
        // Use optional chaining (?.) to prevent errors if a file is not uploaded
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        // Optional: Check if essential data is present
        if (!name || !description || !price || !category) {
            return res.status(400).json({ success: false, message: "Missing required product details" });
        }
        
        // Optional: Check if at least one image was uploaded
        const images = [image1, image2, image3, image4].filter(img => img !== undefined);
        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one product image is required" });
        }

        // 3. Prepare the data for the database
        const productData = {
            name,
            description,
            price: Number(price), // Ensure price is a number
            category,
            subCategory,
            sizes: sizes ? JSON.parse(sizes) : [], // Parse sizes if it's a JSON string
            bestseller: bestseller === "true", // Convert string to boolean
            image1: image1?.filename, // Save only the filename
            image2: image2?.filename,
            image3: image3?.filename,
            image4: image4?.filename,
        };

        console.log("Prepared Product Data:", productData);

        // 4. Save the new product to the database
        //    (This is where you would use your Mongoose/Sequelize/etc. model)
        // const newProduct = new productModel(productData);
        // await newProduct.save();
        console.log(">>> DATABASE LOGIC IS A PLACEHOLDER <<<"); // Placeholder for now

        // 5. Send a success response back to the client
        res.json({ success: true, message: "Product Added Successfully" });

    } catch (error) {
        console.log("!!! Error in addProduct:", error);
        // Send an error response
        res.json({ success: false, message: error.message });
    }
}

//function for list product
const listProducts = async (req, res) => {


}

//function for removing products
const removeProduct = async (req, res) => {

}

//function for single product
const singleProduct = async (req, res) => { 

}

export {addProduct, listProducts, removeProduct, singleProduct};
