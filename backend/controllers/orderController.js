import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import dotenv from "dotenv";
import { sendError, sendSuccess } from "../utils/http.js";
dotenv.config();

const INSIDE_DHAKA_FEE = 60;
const OUTSIDE_DHAKA_FEE = 120;
const VALID_ORDER_STATUSES = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'];

const getDeliveryFee = (address) => {
    const city = address?.city || "";
    const state = address?.state || "";
    const isInsideDhaka = city.toLowerCase().includes("dhaka") || state.toLowerCase().includes("dhaka");
    return isInsideDhaka ? INSIDE_DHAKA_FEE : OUTSIDE_DHAKA_FEE;
};

const calculateOrderAmount = async (items, address) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Order must include at least one item");
    }

    if (!address?.city || !address?.state) {
        throw new Error("Address city and state are required");
    }

    let calculatedAmount = 0;

    for (const item of items) {
        const quantity = Number(item.quantity);
        if (!item._id || !Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("Each order item must include product ID and positive quantity");
        }

        const product = await productModel.findById(item._id);
        if (!product) {
            throw new Error(`Product not found: ${item.name || item._id}`);
        }

        calculatedAmount += product.price * quantity;
    }

    return calculatedAmount + getDeliveryFee(address);
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, address, note } = req.body;

        const calculatedAmount = await calculateOrderAmount(items, address);

        const orderData = {
            userId,
            items,
            address,
            amount: calculatedAmount,
            note, // Include note
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        sendSuccess(res, { message: "Order Placed" });

    } catch (error) {
        console.log(error);
        sendError(res, 400, error.message);
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        sendSuccess(res, { orders });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        sendSuccess(res, { orders });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !VALID_ORDER_STATUSES.includes(status)) {
            return sendError(res, 400, "Valid order ID and status are required");
        }

        const order = await orderModel.findByIdAndUpdate(orderId, { status });

        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        sendSuccess(res, { message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

// Placing orders using SSLCOMMERZ
const placeOrderSslcommerz = async (req, res) => {
    try {
        const { userId, items, address, note } = req.body;

        const calculatedAmount = await calculateOrderAmount(items, address);

        const orderData = {
            userId,
            items,
            address,
            amount: calculatedAmount,
            note, // Include note
            paymentMethod: "SSLCommerz",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const store_id = process.env.SSLCOMMERZ_STORE_ID;
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';
        const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

        const SSLCommerzPayment = await import('sslcommerz-lts');
        const sslcommerz = new SSLCommerzPayment.default(store_id, store_passwd, is_live);

        const data = {
            total_amount: calculatedAmount,
            currency: 'BDT',
            tran_id: newOrder._id.toString(), // Use order ID as transaction ID
            success_url: `${backendUrl}/api/order/payment-success/${newOrder._id}`,
            fail_url: `${backendUrl}/api/order/payment-fail/${newOrder._id}`,
            cancel_url: `${backendUrl}/api/order/payment-cancel/${newOrder._id}`,
            ipn_url: `${backendUrl}/api/order/ipn`,
            shipping_method: 'Courier',
            product_name: 'General',
            product_category: 'General',
            product_profile: 'general',
            cus_name: address.firstName + ' ' + address.lastName,
            cus_email: address.email,
            cus_add1: address.street,
            cus_add2: address.street,
            cus_city: address.city,
            cus_state: address.state,
            cus_postcode: address.zipCode,
            cus_country: address.country,
            cus_phone: address.phone,
            cus_fax: address.phone,
            ship_name: address.firstName + ' ' + address.lastName,
            ship_add1: address.street,
            ship_add2: address.street,
            ship_city: address.city,
            ship_state: address.state,
            ship_postcode: address.zipCode,
            ship_country: address.country,
        };

        const apiResponse = await sslcommerz.init(data);
        
        if(apiResponse?.GatewayPageURL){
            sendSuccess(res, { session_url: apiResponse.GatewayPageURL });
        } else {
            sendError(res, 502, "SSLCommerz Session Creation Failed");
        }

    } catch (error) {
        console.log(error);
        sendError(res, 400, error.message);
    }
}

const paymentSuccess = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { val_id } = req.body;

        // Validate payment with SSLCommerz (Optional but recommended)
        // For now, we assume success if this URL is hit with valid data
        
        await orderModel.findByIdAndUpdate(orderId, { payment: true, transactionId: val_id });
        
        // Redirect to frontend success page
        // Assuming frontend is running on localhost:5173 or similar. 
        // Ideally, we should use an env variable for FRONTEND_URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/order`);

    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

const paymentFail = async (req, res) => {
    try {
        const { orderId } = req.params;
        await orderModel.findByIdAndUpdate(orderId, { status: 'Payment Failed' });
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/cart`); // Redirect back to cart
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

const paymentCancel = async (req, res) => {
    try {
        const { orderId } = req.params;
        await orderModel.findByIdAndUpdate(orderId, { status: 'Payment Cancelled' });
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/cart`);
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
}

const verifyIpn = async (req, res) => {
    try {
        const { tran_id, status, val_id } = req.body;
        console.log('IPN received:', { tran_id, status, val_id });

        if (status === 'VALID' || status === 'AUTHENTICATED') {
            await orderModel.findByIdAndUpdate(tran_id, { 
                payment: true, 
                transactionId: val_id,
                status: 'Order Placed' // Ensure status is correct
            });
            console.log(`Order ${tran_id} marked as paid via IPN`);
        }

        res.status(200).send('IPN Received');
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { placeOrder, allOrders, userOrders, updateStatus, placeOrderSslcommerz, paymentSuccess, paymentFail, paymentCancel, verifyIpn };
