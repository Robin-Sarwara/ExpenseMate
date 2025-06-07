const { refreshAccessToken } = require('../Controller/AuthController');

const router = require('express').Router();

router.put('/refresh-token', refreshAccessToken)

module.exports = router;