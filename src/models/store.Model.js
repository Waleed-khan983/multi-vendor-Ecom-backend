import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
},{timestamps: true})


const Store = mongoose.model("Store", storeSchema);
export default Store;