const express = require('express');
const { sendMessage } = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');
const { optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: 'Too many chat requests, please try again later',
});

router.post('/message', chatLimiter, optionalProtect, sendMessage);

module.exports = router;