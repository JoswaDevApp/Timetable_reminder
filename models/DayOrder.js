const mongoose = require('mongoose');

const dayOrderSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  currentDayOrder: { type: Number, required: true, min: 1, max: 6 },
  isOverride: { type: Boolean, default: false } // Admin manually overrode calculation
}, { timestamps: true });

module.exports = mongoose.model('DayOrder', dayOrderSchema);
