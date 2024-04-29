const redisClient = require('../redis');

module.exports.rateLimiter = (attempts, cooldown, action) => async (req, res, next) => {
    const ip = req.connection.remoteAddress + action;
    const limit = attempts || process.env.RL_ATTEMPTS;

    const [response] = await redisClient.multi().incr(ip).expire(ip, cooldown || process.env.RL_COOLDOWN).exec();
    const currentAttempts = response[1];

    if (currentAttempts > limit) {
        res.status(429).json({
            message: "Rate limited by the server.",
            status: "You've attempted to reach this server too many times in a short period of time. Please try again later.",
            data: {
                loggedIn: false
            },
            errors: [{ "ratelimit": "Too many requests." }],
        })
    } else next();
}