const {
    getUserSessions,
    revokeSessionById,
    deleteAllRefreshTokensForUser,
    COOKIE_OPTS,
    getUserSessionById
} = require("../services/auth.service");

const listSessions = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const sessions = await getUserSessions(userId);
        return res.json({ message: "Fetched all sessions", data: sessions });
    } catch (error) {
        console.log("error in listSessions controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const revokeSession = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const sessionId = parseInt(req.params.sessionId, 10);
        if (Number.isNaN(sessionId)) return res.status(400).json({ message: 'Invalid session id' });

        const found = await getUserSessionById(userId, sessionId)
        if (!found) return res.status(404).json({ message: 'Session not found' });

        await revokeSessionById(sessionId);
        return res.json({ ok: true });
    } catch (error) {
        console.log("error in revokeSession controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const revokeAll = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        await deleteAllRefreshTokensForUser(userId);
        // clear cookies for current client
        res.clearCookie("refresh_token", COOKIE_OPTS)
        res.clearCookie("access_token", COOKIE_OPTS)
        return res.json({ ok: true });
    } catch (error) {
        console.log("error in revokeAll controller", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

module.exports = { listSessions, revokeSession, revokeAll };
