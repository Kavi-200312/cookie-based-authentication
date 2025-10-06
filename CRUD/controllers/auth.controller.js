const { saveRefreshToken, setCookie, COOKIE_OPTS, deleteRefreshTokenByHash, rotateRefreshToken } = require("../services/auth.service");
const { signAccessToken, signRefreshToken, decode } = require("../services/jwt.service");
const { findUserByEmail, createUser, verifyPassword } = require("../services/user.service");

const register = async (req, res) => {
    try {
        const { name, email, age, password } = req.body;

        const existingUser = await findUserByEmail(email)

        if (existingUser) {
            return res.status(400).json({ message: "this email already exists" })
        }
        const user = await createUser(name, email, age, password);

        const accessToken = signAccessToken({ user_id: user.user_id })
        const { refreshToken, jti } = signRefreshToken({ user_id: user.user_id })

        const decoded = decode(refreshToken)
        const expiresAt = new Date(decoded.exp * 1000)

        await saveRefreshToken({
            user_id: user.user_id,
            token: refreshToken,
            jti,
            ip: req.ip,
            device_info: req.get('User-Agent'),
            expiresAt
        })
        setCookie(accessToken, res)
        setCookie(refreshToken, res, "refresh_token")

        return res.status(200).json({ message: "user register successfully!", data: user });

    } catch (error) {
        console.log("error in register controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })

    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        console.log(user, "user>>.....");
        console.log(new Date(), "??????????????");
        console.log(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), "IST Time");
// Expected output: 2025-10-05, 18:41:54 IST Time (adjusted for your current time)

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const { password: hashedPassword, ...userData } = user; 
        if (!hashedPassword) {
            return res.status(500).json({ error: 'User account has no password set' });
        }
        const ok = verifyPassword(password, hashedPassword)
        if (!ok) {
            return res.status(400).json({ message: "invalid credentials" })
        }

        const accessToken = signAccessToken({ user_id: user.user_id })
        const { refreshToken, jti } = signRefreshToken({ user_id: user.user_id })

        const decoded = decode(refreshToken)
        const expiresAt = new Date(decoded.exp * 1000)

        await saveRefreshToken({
            user_id: user.user_id,
            token: refreshToken,
            jti,
            ip: req.ip,
            device_info: req.get('User-Agent'),
            expiresAt
        })
        setCookie(accessToken, res)
        setCookie(refreshToken, res, "refresh_token")

        return res.status(200).json({
            message: "user login successfully!",
            data: userData
        });

    } catch (error) {
        console.log("error in login controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })

    }
}

const refresh = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies?.refresh_token;
        if (!oldRefreshToken) return res.status(401).json({ message: 'No refresh token found' });

        // rotateRefreshToken throws on reuse detection or expiry
        const { accessToken, refreshToken } = await rotateRefreshToken(oldRefreshToken, req );

        setCookie(accessToken, res)
        setCookie(refreshToken, res, "refresh_token")

        return res.json({ ok: true });
    } catch (error) {
        // on reuse detection we want to clear cookies too
        res.clearCookie("refresh_token", COOKIE_OPTS)
        res.clearCookie("access_token", COOKIE_OPTS)
        console.log("error in logout controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const logout = async (req, res) => {
    try {
        const refresh = req.cookies?.refresh_token
        if (refresh) {
            await deleteRefreshTokenByHash(refresh)
        }
        res.clearCookie("refresh_token", COOKIE_OPTS)
        res.clearCookie("access_token", COOKIE_OPTS)
        return res.status(200).json({ ok: true });

    } catch (error) {
        console.log("error in logout controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })

    }
}


module.exports = {
    register,
    login,
    refresh,
    logout,
}