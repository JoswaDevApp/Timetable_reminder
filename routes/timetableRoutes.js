const express = require('express');
const router = express.Router();
const { getTodayTimetable, getWeeklyTimetable, createMyTimetable } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/today', getTodayTimetable);
router.get('/weekly', getWeeklyTimetable);
router.post('/mine', createMyTimetable);

module.exports = router;
