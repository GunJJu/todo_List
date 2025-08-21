const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true
}))
app.use(cookieParser())

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo DB 연결 성공!"))
    .catch((err) => console.log("연결 실패 ㅜ", err))


const todoRoutes = require('./routes/todoRoutes')
app.use('/api/todos', todoRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send("Hello express")
})

app.listen(PORT, () => {
    console.log("Server is running..!")
})