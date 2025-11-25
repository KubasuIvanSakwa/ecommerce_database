import mongoose from "mongoose";
import SubCategory from "../models/subCategory.model.js";
import Category from "../models/category.model.js";


export const createSubCategory = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // add a category
        const { name, category } = req.body

        //check if user already exists
        const existingSubCategory = await SubCategory.findOne({ name, category })
        const existingCategory = await Category.findById(category)

        console.log(existingCategory)

        if(existingSubCategory) {
            const error = new Error("subCategory already exists")
            error.statusCode = 400
            throw error
        }

        if(!existingCategory) {
            const error = new Error("Category does not exists")
            error.statusCode = 404
            throw error
        }

        if(!name) {
            const error = new Error("subCategory cannot be empty")
            error.statusCode = 400
            throw error
        }




        // if new cat
        const subCategory = await SubCategory.create([{ name, category }], { session })

        await session.commitTransaction()
        session.endSession()
        res.status(201).json({
            success: true,
            message: "subCategory created successfully",
            data: {
                SubCategory: subCategory[0],
            }
        })

    } catch(error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

export const deleteSubCategory = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const DeletedCat = await SubCategory.deleteOne({ _id: req.params.id })

        const { deleteCount } = DeletedCat

        if(deleteCount === 0) {
            const error = new Error('subCategory not found')
            error.statusCode = 404
            throw error
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "subCategory was deleted successfully"
        })

    } catch(error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}