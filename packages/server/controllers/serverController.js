// const session = require("express-session");
// const redisClient = require("../redis");
// const RedisStore = require("connect-redis").default;
require("dotenv").config();

// const sessionMiddleware = session({
//     secret: process.env.JWT_SECRET,
//     credentials: true,
//     name: "sid",
//     store: new RedisStore({ client: redisClient }),
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: process.env.NODE_ENV === "production",
//         httpOnly: process.env.NODE_ENV === "production",
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//         maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//     }
// })

// const wrap = (expressMiddleware) => (socket, next) => expressMiddleware(socket.request, {}, next)

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

// module.exports = { corsOptions, sessionMiddleware, wrap };
module.exports = { corsOptions };