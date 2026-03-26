import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters long"],
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["customer", "vendor", "admin"],
        default: "customer",
        lowercase: true
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;