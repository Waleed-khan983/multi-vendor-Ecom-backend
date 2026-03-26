import stripe from "../config/stripe.js";
import Order from "../models/order.Model.js";

export const createCheckoutSession = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId).populate("orderItem.product");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // convert orderItem to stripe format
        const line_items = order.orderItem.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                },

                unit_amount: item.price * 100, // Stripe uses cents

            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "https://localhost:3000/success",
            cancel_url: "https://localhost:3000/cancel",
            metadata: {
                orderId: order._id.toString(),
            },
        });

        res.status(200).json({
            success: true,
            url: session.url,
        })


    } catch (error) {
        next(error);
    }
}



export const stripeWebhook = async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );


    } catch (error) {
        next(error)
    }
    // Handle event

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const order = await Order.findById(orderId);

        if (order) {
            order.status = "completed";
            await order.save();
        }
    }

    res.status(200).json({
        success: true,

    })

}