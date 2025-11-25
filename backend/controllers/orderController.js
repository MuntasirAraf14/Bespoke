import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Placing orders using SSLCOMMERZ
const placeOrderSslcommerz = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "SSLCommerz",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const store_id = process.env.SSLCOMMERZ_STORE_ID;
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

        const SSLCommerzPayment = await import('sslcommerz-lts');
        const sslcommerz = new SSLCommerzPayment.default(store_id, store_passwd, is_live);

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: newOrder._id.toString(), // Use order ID as transaction ID
            success_url: `${origin}/api/order/payment-success/${newOrder._id}`,
            fail_url: `${origin}/api/order/payment-fail/${newOrder._id}`,
            cancel_url: `${origin}/api/order/payment-cancel/${newOrder._id}`,
            ipn_url: `${origin}/api/order/ipn`,
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
            res.json({ success: true, session_url: apiResponse.GatewayPageURL });
        } else {
            res.json({ success: false, message: "SSLCommerz Session Creation Failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
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
        res.json({ success: false, message: error.message });
    }
}

const paymentFail = async (req, res) => {
    try {
        const { orderId } = req.params;
        // You might want to delete the order or mark it as failed
        // await orderModel.findByIdAndDelete(orderId);
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/cart`); // Redirect back to cart
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const paymentCancel = async (req, res) => {
    try {
        const { orderId } = req.params;
        // await orderModel.findByIdAndDelete(orderId);
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/cart`);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, allOrders, userOrders, updateStatus, placeOrderSslcommerz, paymentSuccess, paymentFail, paymentCancel };
