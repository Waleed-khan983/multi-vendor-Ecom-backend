import Order from "../models/order.Model.js";


export const createOrder = async (req, res, next) => {
    try {
        const { orderItem, shippingAddress, totalPrice } = req.body;

        const order = await Order.create({
            user: req.user._id,
            orderItem,
            shippingAddress,
            totalPrice
        })

        res.status(201).json({
            success: true,
            order
        })
    } catch (error) {
        next(error);
    }
}

// get logged in user orders
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).populate("orderItem.product", "name price")

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            })
        }

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        next(error);
    }
}

// get single order
export const getSingleOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("user", "name email")

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        next(error);
    }
}


// get all orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("orderItem.product", "name, price");

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        next(error)
    }
}


// updateing order status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // admin full access
        if (req.user.role === "admin") {
            order.orderStatus = orderStatus;
            await order.save();
        }

        // vendor can only update their own order
        if (req.user.role === "vendor") {
            const isOwner = order.orderItem.some(item => item.product.owner.toString() === req.user._id.toString()
            );

            if (!isOwner) {
                return res.status(403).json({
                    success: false,
                    message: "You can update only your orders",
                });

            }

            order.orderStatus = orderStatus;
            await order.save();

        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        next(error)
    }
}


// Revenue calculation for admin Dashboard
export const getTotalRevenue = async (req, res, next) => {
    try {
        const orders = await Order.find({orderStatus: "Paid || paid"});

        const revenue = orders.reduce((acc, order) => {
            return acc + order.totalPrice;

        }, 0);

        res.status(200).json({
            success: true,
            totalRevenue: revenue
        })
    } catch (error) {
        next(error)
    }
}


// get vendor orders
export const getVendorOrders = async (req, res, next) => {
    try {
        const vendorId = req.user._id;

        const orders = await Order.find()
            .populate("orderItem.product", "name owner");

        const vendorOrders = orders.filter(order =>
            order.orderItem.some(item =>
                item.product.owner.toString() === vendorId.toString()
            ))

        res.status(200).json({
            success: true,
            count: vendorOrders.length,
            orders: vendorOrders
        });

    } catch (error) {
        next(error)
    }
}