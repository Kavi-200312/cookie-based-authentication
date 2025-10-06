const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
require("dotenv").config()


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRY
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY

const signAccessToken = (payload) => {
    return jwt.sign({ ...payload }, ACCESS_SECRET, { expiresIn: ACCESS_EXP })
}

const signRefreshToken = (payload) => {
    const jti = uuidv4()
    const refreshToken = jwt.sign({ ...payload, jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXP })
    return { refreshToken, jti }
}


const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET)
}

const decode = (token) => {
    return jwt.decode(token)
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    decode,
}