const express = require('express');
const validateForm = require('../controllers/validateForm');
const router = express.Router();
const { handleLogin, attemptLogin } = require('../controllers/authController');
const { attemptRegister } = require('../controllers/registerController');
const { rateLimiter } = require('../controllers/rateLimiter');

router
    .route("/login")
    .get(handleLogin)
    .post(rateLimiter(10, 60, "login"), validateForm, attemptLogin);

router.post("/register", rateLimiter(1, 60, "register"), validateForm, attemptRegister);

module.exports = router