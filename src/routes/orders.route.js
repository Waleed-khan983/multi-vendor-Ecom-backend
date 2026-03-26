import express from "express";

import {
    createOrder,
    getMyOrders,
    getSingleOrder,
    getAllOrders,
    getTotalRevenue,
    updateOrderStatus,
    getVendorOrders
} from "../controllers/order.Controller.js";

import { authMiddleware, authorizeRoles } from "../middlewares/auth.Middleware.js"; 
const router = express.Router();

router.post("/order/new", authMiddleware, createOrder);
router.get("/orders/me", authMiddleware, getMyOrders);
router.get("/order/:id", authMiddleware, getSingleOrder);
router.put("/order/:id", authMiddleware, authorizeRoles("admin", "vendor"), updateOrderStatus);
router.get("/admin/revenue", authMiddleware, authorizeRoles("admin"), getTotalRevenue);
router.get("/admin/orders", authMiddleware, authorizeRoles("admin"), getAllOrders);
router.get("/vendor/orders", authMiddleware, authorizeRoles("vendor"), getVendorOrders);

export default router;