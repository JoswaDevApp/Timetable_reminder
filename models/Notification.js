const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['DailySchedule', 'ClassReminder', 'ChangeAlert', 'Announcement'], required: true },
  recipientRole: {
    type: String,
    enum: ['All', 'Admin', 'Teacher', 'Student'],
    default: 'All'
  },
  // Targeted fields for specific alerts
  targetDepartment: {
    type: String
  },
  targetYear: {
    type: Number
  },
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If targeted
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
