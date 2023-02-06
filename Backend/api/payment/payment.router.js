const { userPayment } = require('./payment.controller');

const router = require('express').Router();

router.post('/', userPayment)

module.exports = router