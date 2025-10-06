const crypto = require("crypto")
const { signAccessToken, signRefreshToken, decode, verifyRefreshToken } = require("./jwt.service")
const pool = require("../database/database")


const COOKIE_OPTS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
}

const hashToken = (token) => {
    return crypto.createHmac("sha256", process.env.REFRESH_TOKEN_HASH_SECRET).update(token).digest("hex")
}

const saveRefreshToken = async ({ user_id, token, jti, ip, device_info, expiresAt }) => {
    const token_hash = hashToken(token)
    await pool.execute(`
        INSERT INTO refresh_tokens ( user_id, token_hash, jti, ip, device_info, expires_at) values (?, ?, ?, ?, ?, ?)`,
        [user_id, token_hash, jti, ip || null, device_info || null, expiresAt]
    )
}

const setCookie = (token, res, cookieName = "access_token") => {
    const cookie_exp = cookieName === "access_token" ? 15 : 30 * 24 * 60
    res.cookie(cookieName, token, {
        ...COOKIE_OPTS,
        maxAge: cookie_exp * 60 * 1000
    })
}

const deleteRefreshTokenByHash = async (token) => {
    const token_hash = hashToken(token)
    await pool.execute(`DELETE FROM refresh_tokens WHERE token_hash = ?`, [token_hash])
}

const deleteRefreshTokenByJti = async (jti) => {
    await pool.execute('DELETE FROM refresh_tokens WHERE jti = ?', [jti]);
}

const deleteAllRefreshTokensForUser = async (user_id) => {
    await pool.execute(`DELETE FROM refresh_tokens WHERE user_id = ?`, [user_id])

}

const findRefreshByHash = async (token) => {
    const token_hash = hashToken(token);
    const [rows] = await pool.execute('SELECT * FROM refresh_tokens WHERE token_hash = ?', [token_hash]);
    console.log(rows, "rows");

    return rows[0];
}

const findRefreshByJti = async (jti) => {
    const [rows] = await pool.execute('SELECT * FROM refresh_tokens WHERE jti = ?', [jti]);
    return rows[0];
}

const rotateRefreshToken = async (oldRefreshToken, req) => {
    console.log(oldRefreshToken, "oldRefreshToken?????????????????");

    const { user_id, jti } = verifyRefreshToken(oldRefreshToken);

    console.log(user_id, jti, "user_id, jti");


    // Check DB for old token record
    const record = await findRefreshByHash(oldRefreshToken);

    if (!record) {
        // signature valid but token not in DB => token reuse detected
        // revoke all user's sessions
        if (user_id) {
            await deleteAllRefreshTokensForUser(user_id);
        }
        const err = new Error('Refresh token reuse detected. All sessions revoked.');
        err.status = 401;
        throw err;
    }
    // If found but expired (redundant because jwt.verify would fail if expired,
    // but DB may have older record) handle defensively
    if (new Date(record.expires_at) < new Date) {
        await deleteRefreshTokenByHash(oldRefreshToken);
        const err = new Error('Refresh token expired');
        err.status = 401;
        throw err;
    }
    await deleteRefreshTokenByHash(oldRefreshToken)


    const newAccessToken = signAccessToken({ user_id })
    const { refreshToken: newRefreshToken, jti: newJti } = signRefreshToken({ user_id })

    const decoded = decode(newRefreshToken)
    const expiresAt = new Date(decoded.exp * 1000)

    await saveRefreshToken({
        user_id: user_id,
        token: newRefreshToken,
        jti: newJti,
        ip: req.ip,
        device_info: req.get('User-Agent'),
        expiresAt
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

const getUserSessions = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT id, jti, device_info, ip, expires_at, created_at FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows;
}

const getUserSessionById = async (userId, sessionId) => {
    const [rows] = await pool.execute(
        `SELECT id, jti, device_info, ip, expires_at, created_at FROM refresh_tokens WHERE user_id = ? AND id =?`,
        [userId, sessionId]
    );
    return rows[0];
}

const revokeSessionById = async (sessionId) => {
    await pool.execute('DELETE FROM refresh_tokens WHERE id = ?', [sessionId]);
}

module.exports = {
    COOKIE_OPTS,
    hashToken,
    saveRefreshToken,
    setCookie,
    deleteRefreshTokenByHash,
    deleteRefreshTokenByJti,
    deleteAllRefreshTokensForUser,
    findRefreshByHash,
    findRefreshByJti,
    rotateRefreshToken,
    getUserSessions,
    getUserSessionById,
    revokeSessionById,
}