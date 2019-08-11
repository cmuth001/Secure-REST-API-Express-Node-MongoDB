const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();
router.route('/signup').get(controller.authIndex)
                        .post(controller.authSignup);
router.route('/login').post(controller.login);

module.exports = router;