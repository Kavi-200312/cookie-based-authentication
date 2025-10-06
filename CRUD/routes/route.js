const express = require("express")
const { addUser } = require("../controllers/CRUD")


const router = express.Router()

router.post("/user" , addUser)

module.exports =router