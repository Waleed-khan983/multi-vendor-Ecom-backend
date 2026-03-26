import express from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/payment.controller.js";
import { authMiddleware} from "../middlewares/auth.Middleware.js"
const router = express.Router();

router.post("/checkout",authMiddleware, createCheckoutSession );

router.post("/webhook", express.raw({type: "application/json"}), stripeWebhook);

export default router;