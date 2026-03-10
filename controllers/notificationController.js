const Notification = require('../models/Notification');

// @desc    Get custom notifications for a User
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = async (req, res) => {
  try {
    const user = req.user;
    
    // Base match for 'All' or direct recipientUser
    let matchConditions = [
      { recipientRole: 'All' },
      { recipientUser: user._id }
    ];

    if (user.role === 'Student') {
       matchConditions.push({
          recipientRole: 'Student',
          targetDepartment: user.department,
          targetYear: user.year
       });
    } else if (user.role === 'Teacher') {
       matchConditions.push({
          recipientRole: 'Teacher',
          recipientUserId: user._id
       });
    } else if (user.role === 'Admin') {
       matchConditions.push({ recipientRole: 'Admin' });
    }

    const notifications = await Notification.find({
      $or: matchConditions
    }).sort('-sentAt').limit(20);
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
