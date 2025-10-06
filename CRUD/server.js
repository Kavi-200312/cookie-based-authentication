const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const router = require("./routes/route")
const auth = require("./routes/auth.route")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

console.log("sdfgfdfg");


app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", auth)
app.use("/api", router)

const port = process.env.PORT
app.listen(port, () => {
    console.log("server connected in port ", port);

})