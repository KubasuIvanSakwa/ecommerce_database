import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
 /* 
    user -> ref from user.model.js
    items
    shippingAddress
    paymentMethod
    paymentStatus
    orderStatus
    totalAmount
    mpesaRef
 */
}, { timestamps: true})

const Order = mongoose.model('order', orderSchema)

export default Order