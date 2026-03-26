import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)
        if (conn) {
            console.log(`Connnected to mongodb ${conn.connection.host}`)
        }
    } catch (error) {
        console.log("Connection error", error)
        process.exit(1)

    }
}
export default connectDB    