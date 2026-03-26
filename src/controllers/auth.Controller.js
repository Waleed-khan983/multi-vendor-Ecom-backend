import User from "../models/user.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({id: userId }, process.env.JWT_SECRET, { 'expiresIn': '1d' });
}

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }

         
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({   
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const savedUser = await User.create({
            name,
            email,
            role,
            password: hashedPassword,
        });

        return res.status(201).json({    
            success: true,
            message: "User registered successfully",
            data: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            }
        });

    } catch (error) {
        next(error);
    }
};
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

       

        const comparePassword = await bcrypt.compare(password.trim(), user.password);

        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user.id);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            data: {
                id: user.id,
                name: user.name,
                token
            }
        });

    } catch (error) {
        next(error);
    }
};


 