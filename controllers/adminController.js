const Timetable = require('../models/Timetable');
const User = require('../models/User');
const DayOrder = require('../models/DayOrder');
const Notification = require('../models/Notification');

// @desc    Get all users (for admin management)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all teacher users
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('_id name email department');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload/Create a timetable entry
// @route   POST /api/admin/timetable
// @access  Private/Admin
exports.createTimetable = async (req, res) => {
  try {
    const { department, year, dayOrder, period, subject, teacher, classroom } = req.body;
    
    // Check if slot already occupied
    const existingSlot = await Timetable.findOne({ department, year, dayOrder, period });
    if (existingSlot) {
       // We can update or reject. Let's create an update endpoint for existing
       return res.status(400).json({ message: 'Timetable slot already occupied. Please update instead.' });
    }

    // Find Teacher User ID by Email or direct ID string if needed.
    // The form currently accepts Teacher user object ID
    
    // Check if teacher exists
    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== 'Teacher') {
       return res.status(400).json({ message: 'Invalid Teacher ID or User is not a Teacher' });
    }

    const timetable = await Timetable.create({
      department,
      year,
      dayOrder,
      period,
      subject,
      teacher: teacherUser._id,
      classroom
    });

    // Notify Teacher Immediately
    await Notification.create({
       title: `New Class Assigned: ${subject}`,
       message: `Admin has assigned you to teach ${subject} for ${department} Year ${year} on Day ${dayOrder}, Period ${period} in Room ${classroom}.`,
       type: 'ChangeAlert',
       recipientRole: 'Teacher',
       recipientUserId: teacherUser._id
    });

    // Notify Students Immediately
    await Notification.create({
       title: `Timetable Updated: ${subject}`,
       message: `Admin has scheduled a ${subject} class on Day ${dayOrder}, Period ${period} in Room ${classroom}.`,
       type: 'ChangeAlert',
       recipientRole: 'Student',
       targetDepartment: department,
       targetYear: year
    });

    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all active timetables across the college
// @route   GET /api/admin/timetable
// @access  Private/Admin
exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({})
       .populate('teacher', 'name email')
       .sort('dayOrder period department');
       
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching timetables' });
  }
};

// @desc    Update Day Order settings
// @route   POST /api/admin/dayorder
// @access  Private/Admin
exports.updateDayOrder = async (req, res) => {
  try {
    const { date, currentDayOrder, isOverride } = req.body;
    const parsedDate = new Date(date);
    
    // Reset time to zero for accurate distinct day tracking
    parsedDate.setHours(0, 0, 0, 0);

    let dayOrderEntry = await DayOrder.findOne({ date: parsedDate });
    if (dayOrderEntry) {
      dayOrderEntry.currentDayOrder = currentDayOrder;
      dayOrderEntry.isOverride = isOverride;
      await dayOrderEntry.save();
    } else {
      dayOrderEntry = await DayOrder.create({
        date: parsedDate,
        currentDayOrder,
        isOverride
      });
    }

    res.status(200).json(dayOrderEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Trigger Manual Reminders (Simulates Cron)
// @route   POST /api/admin/trigger-reminders
// @access  Private/Admin
exports.triggerReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOrderEntry = await DayOrder.findOne({ date: today });
    if (!dayOrderEntry) {
      return res.status(400).json({ message: 'Day order not set for today. Set it first.' });
    }

    const message = `Good Morning! Today is Day ${dayOrderEntry.currentDayOrder}. Check your app for today's classes.`;
    
    const notification = await Notification.create({
      title: 'Daily Schedule Reminder',
      message: message,
      type: 'DailySchedule',
      recipientRole: 'All'
    });

    res.status(200).json({ message: 'Reminders successfully triggered and staged', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering reminders', error: error.message });
  }
};

// @desc    Trigger Upcoming Class Reminders (Simulates Cron)
// @route   POST /api/admin/trigger-upcoming
// @access  Private/Admin
exports.triggerUpcomingReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOrderEntry = await DayOrder.findOne({ date: today });
    if (!dayOrderEntry) {
      return res.status(400).json({ message: 'Day order not set for today.' });
    }

    // Find all timetable slots for today's Day Order
    const todaysClasses = await Timetable.find({ dayOrder: dayOrderEntry.currentDayOrder })
       .populate('teacher', 'name email');
       
    if (todaysClasses.length === 0) {
      return res.status(200).json({ message: 'No classes scheduled for today to remind about.' });
    }

    // Creating Targeted Next Class Alerts for the matched Students and Teachers
    let notificationsCreated = 0;
    
    for (const slot of todaysClasses) {
       // Alert for Student (Targeted by Dept and Year)
       await Notification.create({
          title: `Upcoming Class: ${slot.subject}`,
          message: `Your ${slot.subject} class in Room ${slot.classroom} begins soon.`,
          type: 'ClassReminder',
          recipientRole: 'Student',
          targetDepartment: slot.department,
          targetYear: slot.year
       });
       
       // Alert for Teacher (Targeted by specific user ID)
       if (slot.teacher) {
           await Notification.create({
              title: `Upcoming Teaching Slot: ${slot.subject}`,
              message: `You are scheduled to teach ${slot.subject} in Room ${slot.classroom} for ${slot.department || 'General'} students soon.`,
              type: 'ClassReminder',
              recipientRole: 'Teacher',
              recipientUserId: slot.teacher._id
           });
       }
       notificationsCreated += 2;
    }

    res.status(200).json({ message: `Successfully staged ${notificationsCreated} upcoming class reminders for respective Students and Teachers.` });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering reminders', error: error.message });
  }
};

// @desc    Clear all timetable records
// @route   DELETE /api/admin/system/timetables
// @access  Private/Admin
exports.clearTimetables = async (req, res) => {
  try {
    const result = await Timetable.deleteMany({});
    res.status(200).json({ message: `Successfully deleted ${result.deletedCount} timetable records.` });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing timetables', error: error.message });
  }
};

// @desc    Clear all notification records
// @route   DELETE /api/admin/system/notifications
// @access  Private/Admin
exports.clearNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({});
    res.status(200).json({ message: `Successfully deleted ${result.deletedCount} notifications.` });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing notifications', error: error.message });
  }
};
