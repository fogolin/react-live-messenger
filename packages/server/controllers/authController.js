const pool = require('../db');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { jwtSign, jwtVerify, jwtGetToken } = require('../jwt/jwtAuth');

module.exports.handleLogin = (req, res) => {
    // if (req.session.user && req.session.user?.username) {
    //     res.status(200).json({
    //         message: "User is already logged in.",
    //         status: "Success",
    //         data: {
    //             loggedIn: true,
    //             username: req.session.user.username,
    //             id: req.session.user.id,
    //             userid: req.session.user.userid
    //         }
    //     })
    // } else {
    //     res.status(401).json({
    //         message: "User is not logged in.",
    //         status: "Unauthorized",
    //         data: {
    //             loggedIn: false
    //         }
    //     })
    // }

    const token = jwtGetToken(req)
    if (!token) {
        res.status(401).json({
            message: "User is not logged in.",
            status: "Unauthorized",
            errors: [
                { "error": "Token not found." }
            ],
            data: {
                loggedIn: false
            }
        })
    }

    jwtVerify(token)
        .then((decoded) => {
            const userSession = {
                username: decoded.username,
                id: decoded.id,
                userid: decoded.userid
            }

            res.status(200).json({
                message: "User is already logged in.",
                status: "Success",
                data: {
                    loggedIn: true,
                    token,
                    ...userSession
                }
            })
        })
        .catch((err) => {
            res.status(401).json({
                message: "User is not logged in.",
                status: "Unauthorized",
                errors: [
                    { "error": err.message }
                ],
                data: {
                    loggedIn: false
                }
            })
        })
}

module.exports.attemptLogin = async (req, res) => {
    const potentialLogin = await pool.query(
        "SELECT * FROM users u WHERE u.username = $1",
        [req.body.username]
    );

    if (potentialLogin.rows.length === 0) {
        res.status(401).json({
            message: "Can't process the request due to invalid credentials.",
            // status: "Username is incorrect.",
            status: "Username or password is incorrect.",
            errors: [
                // { "username": "Username is incorrect." }
                { "unauthorized": "Username or password is incorrect." }
            ],
            data: {
                loggedIn: false
            }
        })
    } else {
        const isSamePass = await bcrypt.compare(
            req.body.password,
            potentialLogin.rows[0].passhash
        )

        if (isSamePass) {
            const userSession = {
                username: req.body.username,
                id: potentialLogin.rows[0].id,
                userid: potentialLogin.rows[0].userid
            }
            // req.session.user = userSession;

            jwtSign(userSession)
                .then(token => {
                    res.status(201).json({
                        message: "User logged in successfully.",
                        status: "Success",
                        token,
                        data: {
                            ...userSession,
                            loggedIn: true
                        }
                    })
                })
                .catch(err => {
                    res.status(401).json({
                        message: "Can't process the request due to an error.",
                        status: "Error",
                        errors: [
                            { "error": err.message }
                        ],
                        data: {
                            loggedIn: false
                        }
                    })
                })

            // res.status(201).json({
            //     message: "User created successfully.",
            //     status: "Success! You're logged in.",
            //     data: {
            //         ...userSession,
            //         loggedIn: true
            //     },
            // })
        } else {
            res.status(401).json({
                message: "Can't process the request due to invalid credentials.",
                status: "Username or password is incorrect.",
                errors: [
                    { "unauthorized": "Username or password is incorrect." }
                ],
                data: {
                    loggedIn: false
                }
            })
        }
    }
}

