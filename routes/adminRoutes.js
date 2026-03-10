const express = require('express');
const router = express.Router();
const { getUsers, getTeachers, createTimetable, getAllTimetables, updateDayOrder, triggerReminders, triggerUpcomingReminders, clearTimetables, clearNotifications } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.get('/teachers', getTeachers);
router.get('/timetable', getAllTimetables);
router.post('/timetable', createTimetable);
router.post('/dayorder', updateDayOrder);
router.post('/trigger-reminders', triggerReminders);
router.post('/trigger-upcoming', triggerUpcomingReminders);
router.delete('/system/timetables', clearTimetables);
router.delete('/system/notifications', clearNotifications);

module.exports = router;
