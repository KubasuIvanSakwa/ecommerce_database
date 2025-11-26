import mongoose, { mongo } from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";

export const createProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      sku,
      category,
      subCategory,
    } = req.body;

    const existingSku = await Product.findOne({ sku });
    const existingCategory = await Category.findById(category);

    if (
      !name ||
      !description ||
      !price ||
      !stockQuantity ||
      !sku ||
      !category
    ) {
      const error = new Error("Some fields are missing");
      error.statusCode = 400;
      throw error;
    }

    if (existingSku) {
      const error = new Error("SKU already exists");
      error.statusCode = 400;
      throw error;
    }

    if (!existingCategory) {
      const error = new Error("Category does not exist");
      error.statusCode = 404;
      throw error;
    }

    if (subCategory) {
      const existingSubCategory = await SubCategory.findById(subCategory);

      if (!existingSubCategory) {
        const error = new Error("subCategory does not exist");
        error.statusCode = 404;
        throw error;
      }
    }

    // Step 1: Create a base object with required fields
    const productData = {
      name,
      description,
      price,
      stockQuantity,
      sku,
      category,
    };

    // Step 2: Conditionally add optional fields if they are present in req.body
    if (req.body.images) {
      productData.images = req.body.images;
    }
    if (req.body.subCategory) {
      productData.subCategory = req.body.subCategory;
    }

    const product = await Product.create([productData], { session });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "product created successfully",
      data: {
        Product: product[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const AllProducts = async (req, res, next) => {
    try {
    const products = await Product.find().select("-password");

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

export const updateProduct = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        if(Object.keys(req.body).length === 0) {
            const error = new Error("Data to update cannot be empty");
            error.statusCode = 400;
            throw error;
        }

        const product = await Product.findById(req.params.id)

        if(!product) {
            const error = new Error("product not found")
            error.statusCode = 400
            throw error
        }

        let updates = {}

        const obj = ['name', 'description', 'price', 'stockQuantity', 'sku', 'images', 'category', 'subCategory']

        for (const key in req.body) {
          if (obj.includes(key)) {
            if (req.body[key]) {
              updates[key] = req.body[key];
            }
          }
        }

        if(updates.category) {
            const existingCategory = await Category.findById(updates.category)
            if(!existingCategory) {
                const error = new Error("Category not found");
                error.statusCode = 404;
                throw error;
            }
        }

        if(updates.sku) {
            const existingSku = await Product.findOne({ 
                sku: updates.sku,
                _id: { $ne: req.params.id } 
            })
            if(existingSku) {
                const error = new Error("sku already exists");
                error.statusCode = 400;
                throw error;
            }
        }

        if(updates.subCategory) {
            const existingSubCategory = await SubCategory.findById(updates.subCategory)
            if(!existingSubCategory) {
                const error = new Error("SubCategory not found");
                error.statusCode = 404;
                throw error;
            }
        }

        const updateProduct = await Product.updateOne(
            { _id: req.params.id },
            { $set: { ...updates } },
            { session }
        )

        await session.commitTransaction()
        const newUpdatedProduct = await Product.findById(req.params.id)

        session.endSession()
        res.status(200).json({
            success: true,
            message: "Product updated",
            data: {
                product: newUpdatedProduct
            }
        })
    }catch(error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}
