const express = require('express');
const router = express.Router();
const { getCurrentDayOrder } = require('../controllers/dayOrderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/current', getCurrentDayOrder);

module.exports = router;
