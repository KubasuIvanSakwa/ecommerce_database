import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
 /* 
    user --> ref from user.model.js
    items -> ref from product.mmodel.js
    subtotal
 */
}, { timestamps: true})

const Cart = mongoose.model('cart', cartSchema)

export default Cart