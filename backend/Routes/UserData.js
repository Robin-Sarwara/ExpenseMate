const { getUserData, sendOtp, updateUserData } = require('../Controller/UserDataController');
const { authenticateToken } = require('../Middleware/AuthenticateToken');
const { validateSendOtp, validateUserUpdate } = require('../Middleware/userUpdateValidation');

const router = require('express').Router();

router.get('/userdata',authenticateToken, getUserData )
router.post('/send-otp',authenticateToken,validateSendOtp, sendOtp)
router.put('/update/user-data',authenticateToken,validateUserUpdate, updateUserData )
module.exports = router;