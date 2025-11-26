import mongoose from "mongoose";
import Category from "../models/category.model.js";


export const createCategory = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // add a category
        const { name } = req.body

        const existingCategory = await Category.findOne({ name })

        if(existingCategory) {
            const error = new Error("Category already exists")
            error.statusCode = 400
            throw error
        }

        if(!name) {
            const error = new Error("Category cannot be empty")
            error.statusCode = 400
            throw error
        }


        // if new cat
        const category = await Category.create([{ name }], { session })

        await session.commitTransaction()
        session.endSession()
        res.status(201).json({
            success: true,
            message: "category created successfully",
            data: {
                Category: category[0],
            }
        })

    } catch(error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('SubCategories')

    res.status(200).json({ 
        success: true,  
        data: categories 
    });
  } catch (error) {
    next(error);
  }
}

