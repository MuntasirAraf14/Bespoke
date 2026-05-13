import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import dbReady from '../middleware/dbReady.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, dbReady, upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1},{name: 'image4', maxCount: 1}]), addProduct);

productRouter.get('/list', dbReady, listProducts);
productRouter.post('/remove', adminAuth, dbReady, removeProduct);
productRouter.post('/single', dbReady, singleProduct);



export default productRouter
