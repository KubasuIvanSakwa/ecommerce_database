import mongoose, { mongo } from "mongoose";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const createCart = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { user, items } = req.body
        const exstingUser = await User.findById(user)

        if(!exstingUser) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw(error)
        }

        if(!items) {
            const error = new Error('cart cannot be empty')
            error.statusCode = 400
            throw(error)
        }

        const incomingItems = req.body.items; 

        let calculatedSubtotal = 0;
        let cleanCart = [];

        for (const item of incomingItems) {
            
            const productDocument = await Product.findById(item.productId); 

            if (!productDocument) {
                const error = new Error(
                    `Product with ID ${item.productId} not found.`
                );
                error.statusCode = 404;
                throw error;
            }

            if(item.quantity <= 0) {
                const error = new Error(
                    `Product quantity cannot be zero.`
                );
                error.statusCode = 400;
                throw error;
            }


            const itemPrice = productDocument.price;
            const lineTotal = item.quantity * itemPrice;

            cleanCart.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtOrder: itemPrice 
            });

            calculatedSubtotal += lineTotal;
        }

        const userCart = await Cart.create([{ user, items: cleanCart, subtotal: calculatedSubtotal}], { session })

        await session.commitTransaction()
        session.endSession()
        res.status(201).json({
            success: true,
            data: userCart
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}