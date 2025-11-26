import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";
import { createSubCategory, deleteSubCategory } from "../controllers/subCategory.controller.js";


const categoryRouter = Router()


categoryRouter.post('/create-category', authorize, createCategory)

categoryRouter.get('/', authorize, getAllCategories)

// categoryRouter.put('/:id', authorize, updateCategory)

// categoryRouter.delete('/:id', authorize, deleteCategory)

// SubCategory routes
categoryRouter.post('/subcategory', authorize, createSubCategory)

categoryRouter.delete('/subcategory/:id', authorize, deleteSubCategory)


export default categoryRouter