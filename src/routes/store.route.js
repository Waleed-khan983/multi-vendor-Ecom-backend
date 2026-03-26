import express from "express";
import { createStore, approveStore } from "../controllers/store.Controller.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create", authMiddleware, authorizeRoles("vendor"), createStore);
router.post("/approve/:id", authMiddleware, authorizeRoles("admin"), approveStore);
router.put("/approve/:id", authMiddleware, authorizeRoles("admin"), approveStore);
export default router;