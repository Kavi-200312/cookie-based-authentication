// middleware/auth.middleware.js

const { verifyAccessToken } = require("../services/jwt.service");
const { findUserById } = require("../services/user.service");

const protecteRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        if (!token) return res.status(401).json({ message: 'Not authenticated' });

        const payload = verifyAccessToken(token); // throws if invalid/expired
        const userId = payload.user_id;

        const user = await findUserById(userId);
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        console.log("error in ProectRoute middleware", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { protecteRoute };
