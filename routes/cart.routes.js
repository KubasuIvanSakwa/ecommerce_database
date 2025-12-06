import { Router } from "express";
import { createCart } from "../controllers/cart.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const cartRouter = Router()


cartRouter.post('/:id', authorize, createCart)

export default cartRouter