import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"
import ratelimit from "express-rate-limit";
import { errorMiddleware } from "./middlewares/error.Middleware.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import storeRoute from "./routes/store.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/orders.route.js";
import paymentRoute from './routes/payment.route.js';
export const createApp = () => {
    const app = express();
    app.use(helmet());
    app.use(express.json());
    app.use(morgan("dev"));

    app.use(cors())


    const limiter= ratelimit({
        windowMs: 15 * 60 * 1000, 
        max: 100,
        message: "Too many requests, please try again later",
    });

    app.use("/api", limiter);



    app.get("/", (req, res) => {
        res.send("Backend is running ")
    });

    app.use("/auth", authRoute);
    app.use("/api/test", testRoute);
    app.use("/api/store", storeRoute)
    app.use("/api/products", productRoute);
    app.use("/api", orderRoute);
    app.use("/api/payment", paymentRoute);

    app.use(errorMiddleware);
    return app;
}


 

