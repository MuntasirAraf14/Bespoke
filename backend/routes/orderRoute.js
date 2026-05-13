import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus, placeOrderSslcommerz, paymentSuccess, paymentFail, paymentCancel, verifyIpn } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import { authUser } from '../middleware/auth.js';
import dbReady from '../middleware/dbReady.js';

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, dbReady, allOrders);
orderRouter.post('/status', adminAuth, dbReady, updateStatus);

orderRouter.post('/place', authUser, dbReady, placeOrder);
orderRouter.post('/sslcommerz', authUser, dbReady, placeOrderSslcommerz);
orderRouter.post('/payment-success/:orderId', dbReady, paymentSuccess);
orderRouter.post('/payment-fail/:orderId', dbReady, paymentFail);
orderRouter.post('/payment-cancel/:orderId', dbReady, paymentCancel);
orderRouter.post('/ipn', dbReady, verifyIpn);
orderRouter.post('/userorders', authUser, dbReady, userOrders);

export default orderRouter;
