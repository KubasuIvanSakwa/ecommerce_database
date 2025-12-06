import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabse from "./database/mongodb.js";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/cat', categoryRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)

app.get('/', (req, res) => {
    res.send("eccormerce-database API")
})

app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`Served on PORT http://localhost:${PORT}`)

    await connectToDatabse()
})