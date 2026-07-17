import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import dotenv from "dotenv";
import crypto from "crypto";
import validator from "validator";
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

const requiredAddressFields = [
    "firstName",
    "lastName",
    "email",
    "street",
    "city",
    "state",
    "zipCode",
    "country",
    "phone",
];

const normalizeString = (value) => String(value || "").trim();

const normalizeAddress = (address) => {
    if (!address || typeof address !== "object") {
        throw new Error("Delivery address is required");
    }

    const normalized = requiredAddressFields.reduce((result, field) => {
        result[field] = normalizeString(address[field]);
        return result;
    }, {});

    const missing = requiredAddressFields.filter((field) => !normalized[field]);
    if (missing.length > 0) {
        throw new Error(`Address field(s) missing: ${missing.join(", ")}`);
    }

    if (!validator.isEmail(normalized.email)) {
        throw new Error("A valid delivery email is required");
    }

    return normalized;
};

const buildOrderSnapshot = async (items, address) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Order must include at least one item");
    }

    const normalizedAddress = normalizeAddress(address);
    const productIds = [...new Set(items.map((item) => normalizeString(item?._id || item?.productId)).filter(Boolean))];

    if (productIds.length === 0) {
        throw new Error("Each order item must include a product ID");
    }

    const products = await productModel.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));
    const itemMap = new Map();

    for (const item of items) {
        const productId = normalizeString(item?._id || item?.productId);
        const size = normalizeString(item?.size);
        const quantity = Number(item.quantity);

        if (!productId || !size || !Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("Each order item must include product ID, size, and positive quantity");
        }

        const product = productMap.get(productId);
        if (!product) {
            throw new Error(`Product not found: ${item.name || productId}`);
        }

        if (!product.sizes?.includes(size)) {
            throw new Error(`${product.name} is not available in size ${size}`);
        }

        const key = `${productId}:${size}`;
        const current = itemMap.get(key);
        const nextQuantity = (current?.quantity || 0) + quantity;

        itemMap.set(key, {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            subCategory: product.subCategory,
            size,
            quantity: nextQuantity,
            lineTotal: product.price * nextQuantity,
        });
    }

    const orderItems = [...itemMap.values()];
    const subtotal = orderItems.reduce((total, item) => total + item.lineTotal, 0);
    const deliveryFee = getDeliveryFee(normalizedAddress);

    return {
        items: orderItems,
        address: normalizedAddress,
        deliveryFee,
        amount: subtotal + deliveryFee,
    };
};

const getSslcommerzClient = async () => {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

    const SSLCommerzPayment = await import("sslcommerz-lts");
    return new SSLCommerzPayment.default(storeId, storePassword, isLive);
};

const isValidPaymentStatus = (status) => ["VALID", "VALIDATED", "AUTHENTICATED"].includes(String(status || "").toUpperCase());

const validateSslcommerzPayment = async ({ valId, order }) => {
    if (!valId) {
        throw new Error("Payment validation ID is required");
    }

    const sslcommerz = await getSslcommerzClient();
    const validation = await sslcommerz.validate({ val_id: valId });

    if (!isValidPaymentStatus(validation?.status)) {
        throw new Error("Payment was not validated by SSLCommerz");
    }

    if (String(validation.tran_id) !== order._id.toString()) {
        throw new Error("Payment transaction does not match this order");
    }

    if (String(validation.currency || "").toUpperCase() !== "BDT") {
        throw new Error("Payment currency mismatch");
    }

    const paidAmount = Number(validation.amount);
    if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - order.amount) > 0.01) {
        throw new Error("Payment amount mismatch");
    }

    return validation;
};

const markOrderPaid = async ({ order, validation, valId }) => {
    if (order.payment) {
        return order;
    }

    order.payment = true;
    order.status = "Order Placed";
    order.transactionId = valId;
    order.bankTransactionId = validation.bank_tran_id || null;
    order.paymentValidation = validation;
    order.paymentAttemptToken = null;
    await order.save();
    return order;
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { items, address, note } = req.body;
        const userId = req.userId;

        const orderSnapshot = await buildOrderSnapshot(items, address);

        const orderData = {
            userId,
            items: orderSnapshot.items,
            address: orderSnapshot.address,
            amount: orderSnapshot.amount,
            deliveryFee: orderSnapshot.deliveryFee,
            note: normalizeString(note),
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
        const userId = req.userId;
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
        const { items, address, note } = req.body;
        const userId = req.userId;

        const orderSnapshot = await buildOrderSnapshot(items, address);
        const paymentAttemptToken = crypto.randomBytes(32).toString("hex");

        const orderData = {
            userId,
            items: orderSnapshot.items,
            address: orderSnapshot.address,
            amount: orderSnapshot.amount,
            deliveryFee: orderSnapshot.deliveryFee,
            note: normalizeString(note),
            paymentMethod: "SSLCommerz",
            payment: false,
            paymentAttemptToken,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

        const sslcommerz = await getSslcommerzClient();

        const data = {
            total_amount: orderSnapshot.amount,
            currency: 'BDT',
            tran_id: newOrder._id.toString(), // Use order ID as transaction ID
            success_url: `${backendUrl}/api/order/payment-success/${newOrder._id}?attempt=${paymentAttemptToken}`,
            fail_url: `${backendUrl}/api/order/payment-fail/${newOrder._id}?attempt=${paymentAttemptToken}`,
            cancel_url: `${backendUrl}/api/order/payment-cancel/${newOrder._id}?attempt=${paymentAttemptToken}`,
            ipn_url: `${backendUrl}/api/order/ipn`,
            shipping_method: 'Courier',
            product_name: orderSnapshot.items.map((item) => item.name).join(', ').slice(0, 255) || 'General',
            product_category: 'Fashion',
            product_profile: 'general',
            cus_name: orderSnapshot.address.firstName + ' ' + orderSnapshot.address.lastName,
            cus_email: orderSnapshot.address.email,
            cus_add1: orderSnapshot.address.street,
            cus_add2: orderSnapshot.address.street,
            cus_city: orderSnapshot.address.city,
            cus_state: orderSnapshot.address.state,
            cus_postcode: orderSnapshot.address.zipCode,
            cus_country: orderSnapshot.address.country,
            cus_phone: orderSnapshot.address.phone,
            cus_fax: orderSnapshot.address.phone,
            ship_name: orderSnapshot.address.firstName + ' ' + orderSnapshot.address.lastName,
            ship_add1: orderSnapshot.address.street,
            ship_add2: orderSnapshot.address.street,
            ship_city: orderSnapshot.address.city,
            ship_state: orderSnapshot.address.state,
            ship_postcode: orderSnapshot.address.zipCode,
            ship_country: orderSnapshot.address.country,
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
        const { attempt } = req.query;
        const { val_id } = req.body;

        const order = await orderModel.findById(orderId).select("+paymentAttemptToken");
        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        if (order.paymentAttemptToken !== attempt) {
            return sendError(res, 403, "Invalid payment attempt");
        }

        const validation = await validateSslcommerzPayment({ valId: val_id, order });
        await markOrderPaid({ order, validation, valId: val_id });
        
        // Redirect to frontend success page
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
        const { attempt } = req.query;
        await orderModel.findOneAndUpdate(
            { _id: orderId, payment: false, paymentAttemptToken: attempt },
            { status: 'Payment Failed', paymentAttemptToken: null }
        );
        
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
        const { attempt } = req.query;
        await orderModel.findOneAndUpdate(
            { _id: orderId, payment: false, paymentAttemptToken: attempt },
            { status: 'Payment Cancelled', paymentAttemptToken: null }
        );
        
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

        if (isValidPaymentStatus(status)) {
            const order = await orderModel.findById(tran_id).select("+paymentAttemptToken");
            if (!order) {
                return sendError(res, 404, "Order not found");
            }

            const validation = await validateSslcommerzPayment({ valId: val_id, order });
            await markOrderPaid({ order, validation, valId: val_id });
        }

        res.status(200).send('IPN Received');
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { placeOrder, allOrders, userOrders, updateStatus, placeOrderSslcommerz, paymentSuccess, paymentFail, paymentCancel, verifyIpn };
