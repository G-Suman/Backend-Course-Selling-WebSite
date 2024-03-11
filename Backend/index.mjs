import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app = express();
const PORT = process.env.PORT
import adminRouter from "./routes/admin.mjs";
import userRouter from "./routes/user.mjs"
app.use(express.json())
app.use('/admin' , adminRouter)
app.use('/user' , userRouter)


app.listen(PORT , ()=>{
    console.log(`The server has started on ${PORT}`)
})















