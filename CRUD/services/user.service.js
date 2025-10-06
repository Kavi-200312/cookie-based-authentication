const pool = require('../database/database')
const bcrypt = require('bcryptjs')

const findUserByEmail = async (email) => {
    const row = await pool.execute(`SELECT name, email, age, user_id, password FROM USERS WHERE email = ?`, [email])
    return row[0]?.[0]
}
const findUserById = async (userId) => {
    const row = await pool.execute(`SELECT name, email, age, user_id FROM USERS WHERE user_id = ?`, [userId])
    return row[0]?.[0]
}
const createUser = async (name, email, age, password) => {
    const hashPassword = await bcrypt.hash(password, 10)
    const row = await pool.execute(`INSERT INTO users (name, age, email, password) VALUE (?, ?, ?, ?)`, [name, age, email, hashPassword])
    console.log(row, "row>>>>>>>>.");

    return { user_id: row[0]?.insertId, email, name, age }
}

const verifyPassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

module.exports = {
    findUserByEmail,
    createUser,
    verifyPassword,
    findUserById,
}