require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtSign = (payload) => new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1min' }

    const token = jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
    });

    return token;
})

const jwtVerify = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err)
        resolve(decoded);
    })
})

const jwtGetToken = (req) => {
    return req.headers["authorization"]?.split(" ")[1]
}

module.exports = { jwtGetToken, jwtSign, jwtVerify };