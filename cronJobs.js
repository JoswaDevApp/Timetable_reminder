const cron = require('node-cron');
const DayOrder = require('../models/DayOrder');
const Holiday = require('../models/Holiday');
const Notification = require('../models/Notification');
const Timetable = require('../models/Timetable');

const calculateTodayDayOrder = async () => {
  console.log('Running day-order calculation...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if day order is already set for today to avoid duplicates on restart
    const existingDayOrder = await DayOrder.findOne({ date: today });
    if (existingDayOrder) {
      console.log(`Day order already set to ${existingDayOrder.currentDayOrder} for today. Skip calculation.`);
      return;
    }

    // Check if today is a holiday
    const isHoliday = await Holiday.findOne({ date: today });
    if (isHoliday) {
      console.log(`Today is a holiday: ${isHoliday.reason}. Skipping day order calculation.`);
      return;
    }

    // Check if admin manually overrode today's day order
    const override = await DayOrder.findOne({ date: today, isOverride: true });
    if (override) {
      console.log(`Using admin override for today's Day Order: ${override.currentDayOrder}`);
      return;
    }

    // Find the last working day's order
    const lastDayOrder = await DayOrder.findOne().sort({ date: -1 });

    let nextOrder = 1;
    if (lastDayOrder) {
      nextOrder = lastDayOrder.currentDayOrder === 6 ? 1 : lastDayOrder.currentDayOrder + 1;
    }

    await DayOrder.create({
      date: today,
      currentDayOrder: nextOrder,
      isOverride: false
    });

    console.log(`Day order automatically calculated and set to ${nextOrder} for today.`);
  } catch (error) {
    console.error('Error calculating day-order:', error);
  }
};

const initCronJobs = () => {
  // Run automatically on backend server startup to ensure today is calculated
  calculateTodayDayOrder();

  // Run every day at 00:05 to update day order
  cron.schedule('5 0 * * *', calculateTodayDayOrder);

  // Run every morning at 7:00 AM to send schedule notifications
  cron.schedule('0 7 * * *', async () => {
    console.log('Running 7:00 AM daily schedule notification');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dayOrderEntry = await DayOrder.findOne({ date: today });
      if (!dayOrderEntry) return;

      const message = `Good Morning! Today is Day ${dayOrderEntry.currentDayOrder}. Check your app for today's classes.`;
      
      await Notification.create({
        title: 'Daily Schedule Reminder',
        message: message,
        type: 'DailySchedule',
        recipientRole: 'All'
      });

      // Firebase FCM Logic would be triggered here to actually push to mobile devices.
      console.log('FCM Push triggered for Daily Schedule:', message);
      
    } catch (error) {
      console.error('Error in daily notification cron:', error);
    }
  });

  // Run every 5 minutes to check for upcoming classes (10 mins before start)
  cron.schedule('*/5 * * * *', async () => {
     console.log('Running 5-minute interval check for upcoming classes...');
     try {
        const now = new Date();
        const today = new Date();
        today.setHours(0,0,0,0);

        const dayOrderEntry = await DayOrder.findOne({ date: today });
        if (!dayOrderEntry) return;

        // In a real application, you map `period` (e.g., 1, 2) to specific start times (e.g., 9:00 AM)
        // For demonstration, we'll fetch all classes for today and simulate a generic broadcast.
        // A production app checks: if (slot.startTime - now <= 10 minutes) -> Send Notification
        
        // This simulates a reminder system finding an upcoming class
        console.log(`Checking Timetable for Day Order ${dayOrderEntry.currentDayOrder} classes...`);
     } catch (err) {
        console.error('Error in 5-minute upcoming class check:', err);
     }
  });
};

module.exports = initCronJobs;
