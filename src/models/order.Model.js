import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderItem: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },

            name: String,
            price: Number,
            quantity: Number,
        }
    ],
    shippingAddress: {
        address: String,
        city: String,
        country: String,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: "Processing"
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;