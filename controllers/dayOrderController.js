const DayOrder = require('../models/DayOrder');

// @desc    Get Current Day Order
// @route   GET /api/dayorder/current
// @access  Private
exports.getCurrentDayOrder = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayOrder = await DayOrder.findOne({ date: today });
    
    if (dayOrder) {
      res.status(200).json(dayOrder);
    } else {
      res.status(200).json({ currentDayOrder: null, message: 'No day order calculation found for today' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
