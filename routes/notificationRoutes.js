const express = require('express');
const router = express.Router();
const { getUserNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getUserNotifications);

module.exports = router;
