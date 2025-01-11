const express = require('express')
const router = express.Router()
const {signup,login,logout,verifyEmail,forgotPassword,resetPassword,checkAuth} = require('../controllers/authController')

const {verifyToken} = require('../middleware/verifyToken')

router.get('/checkAuth',verifyToken,checkAuth)

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout', logout);

router.post('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);

// Route for password reset with token
router.post('/reset/:resetToken', resetPassword);

module.exports = router