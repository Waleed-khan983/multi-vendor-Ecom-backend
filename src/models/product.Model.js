import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    description: {
      type: String,
    },

    stock: {
      type: Number,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    image: {
        public_id: String,
        url: String
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;