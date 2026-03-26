import express from "express";

import {
    createProduct, deleteProduct, updateProduct,
    getAllProducts,
    getSingleProduct,
    searchProducts,
    getProductByStore,

} from "../controllers/porduct.controller.js";

import { authMiddleware, authorizeRoles } from "../middlewares/auth.Middleware.js";
import upload from "../middlewares/upload.js";
const router = express.Router();



// public routes
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/store/:storeId", getProductByStore);
router.get("/:id", getSingleProduct);


router.post("/create", authMiddleware, authorizeRoles("vendor"), upload.single("image"), createProduct);
router.delete("/delete/:id", authMiddleware, authorizeRoles("vendor", "admin"), deleteProduct);
router.put("/update/:id", authMiddleware, authorizeRoles("vendor", "admin"), updateProduct);
export default router;