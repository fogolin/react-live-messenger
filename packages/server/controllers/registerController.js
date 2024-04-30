const pool = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require("uuid")

module.exports.attemptRegister = async (req, res) => {
    const existingUser = await pool.query("SELECT username FROM users WHERE username = $1", [req.body.username]);

    if (existingUser.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await pool.query("INSERT INTO users (username, passhash, userid) VALUES ($1, $2, $3) RETURNING *", [req.body.username, hashedPassword, uuidV4()]);

        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid
        }

        res.status(201).json({
            message: "User created successfully.",
            status: "Success! You're logged in.",
            data: {
                username: req.body.username,
                id: newUserQuery.rows[0].id,
                userid: newUserQuery.rows[0].userid,
                loggedIn: true
            },
        })
    } else {
        res.status(409).json({
            message: "Can't process the request due to conflict.",
            status: "Username already in use.",
            errors: [
                { "username": "Username already exists." }
            ],
            data: {
                loggedIn: false
            }
        })
    }
}