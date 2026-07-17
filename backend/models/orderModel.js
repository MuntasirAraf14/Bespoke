import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: [String], default: [] },
    category: { type: String, default: '', trim: true },
    subCategory: { type: String, default: '', trim: true },
    size: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const addressSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: { type: [orderItemSchema], required: true },
    amount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    address: { type: addressSchema, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    transactionId: { type: String, default: null },
    bankTransactionId: { type: String, default: null },
    paymentValidation: { type: Object, default: null },
    paymentAttemptToken: { type: String, default: null, select: false },
    note: { type: String, default: '' } // Added for custom tailoring/order notes
})

orderSchema.index({ userId: 1 });
orderSchema.index({ transactionId: 1 });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
