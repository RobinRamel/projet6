const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { body } = require('express-validator');

router.post('/signup', [
    body('email').isEmail(),
    body( 'password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
], userController.signup);
router.post('/login', userController.login);

module.exports = router;
