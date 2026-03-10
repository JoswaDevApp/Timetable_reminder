const Timetable = require('../models/Timetable');
const DayOrder = require('../models/DayOrder');
const Notification = require('../models/Notification');

// @desc    Get today's timetable for the logged-in user
// @route   GET /api/timetable/today
// @access  Private (Teacher, Student)
exports.getTodayTimetable = async (req, res) => {
  try {
    const user = req.user;
    
    // Get current Day Order
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDayOrder = await DayOrder.findOne({ date: today });
    
    if (!currentDayOrder) {
      return res.status(200).json({ message: 'No Day Order set for today (might be a holiday)', timetable: [] });
    }

    let query = { dayOrder: currentDayOrder.currentDayOrder };

    if (user.role === 'Student') {
      query.department = user.department;
      query.year = user.year;
    } else if (user.role === 'Teacher') {
      query.teacher = user._id;
    }

    const timetable = await Timetable.find(query).populate('teacher', 'name email').sort('period');
    res.status(200).json({ dayOrder: currentDayOrder.currentDayOrder, timetable });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get full weekly timetable
// @route   GET /api/timetable/weekly
// @access  Private
exports.getWeeklyTimetable = async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    if (user.role === 'Student') {
      query.department = user.department;
      query.year = user.year;
    } else if (user.role === 'Teacher') {
      query.teacher = user._id;
    }

    const timetable = await Timetable.find(query).populate('teacher', 'name email').sort('dayOrder period');
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload/Create a personal timetable entry (Teacher/Student)
// @route   POST /api/timetable/mine
// @access  Private
exports.createMyTimetable = async (req, res) => {
  try {
    const { dayOrder, period, subject, classroom } = req.body;
    
    // Check if slot already occupied for this user
    let existingQuery = { dayOrder, period };
    
    if (req.user.role === 'Teacher') {
      existingQuery.teacher = req.user._id;
    } else {
      existingQuery.department = req.user.department;
      existingQuery.year = req.user.year;
    }
    
    const existingSlot = await Timetable.findOne(existingQuery);
    if (existingSlot) {
       return res.status(400).json({ message: 'Timetable slot already occupied for this Day Order and Period.' });
    }

    const timetableData = {
      dayOrder,
      period,
      subject,
      classroom,
      department: req.user.department || 'General' // Default for teachers if unassigned
    };

    if (req.user.role === 'Teacher') {
      timetableData.teacher = req.user._id;
    } else {
      timetableData.year = req.user.year;
    }

    const timetable = await Timetable.create(timetableData);
    
    // Notify Teacher if the slot has a teacher attached
    if (timetable.teacher) {
        await Notification.create({
           title: `Timetable Updated: ${subject}`,
           message: `A new class slot for ${subject} has been added to your schedule on Day ${dayOrder}, Period ${period} in Room ${classroom}.`,
           type: 'ChangeAlert',
           recipientRole: 'Teacher',
           recipientUserId: timetable.teacher
        });
    }

    res.status(201).json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating personal timetable' });
  }
};
