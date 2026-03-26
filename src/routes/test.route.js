import express from "express"
import { authMiddleware, authorizeRoles } from "../middlewares/auth.Middleware.js"


const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "profile accessed successfully",
        user: req.user
    })
})

router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
    res.json({
        success: true,
        message: "welcome admin",
    })
})

router.get("/vendor", authMiddleware, authorizeRoles("vendor"), (req, res) => {
    res.json({
        success: true,
        message: "welcome vendor",
    })
})

export default router;