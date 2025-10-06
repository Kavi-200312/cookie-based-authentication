

const express = require("express");
const { login, logout, register, refresh } = require("../controllers/auth.controller");
const { listSessions, revokeSession, revokeAll } = require("../controllers/session.controller");
const { protecteRoute } = require("../middleware/protecteRoute");

const router = express.Router()

router.post('/register', register)
router.get('/refresh', refresh)
router.post('/login', login)
router.get('/logout', logout)

router.get('/sessions', protecteRoute, listSessions);
router.delete('/sessions/:sessionId', protecteRoute, revokeSession);
router.post('/sessions/revokeAll', protecteRoute, revokeAll);

module.exports = router;