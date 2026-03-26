import { createApp } from "./src/app.js";
import connectDB from "./src/config/db.js";
 
import dotenv from "dotenv"
dotenv.config();


await connectDB();
const app = createApp();
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})

