const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  department: { type: String, required: true },
  year: { type: Number }, // Optional for Teacher-created slots
  dayOrder: { type: Number, required: true, min: 1, max: 6 },
  period: { type: Number, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for Student-created slots
  classroom: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
