const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  peopleInvolved: [{ type: String }],
  reminders: [{
    time: { type: Date },
    sent: { type: Boolean, default: false }
  }],
  notes: String,
  status: {
    type: String,
    enum: ['In Progress', 'Complete', 'Over Due'],
    default: 'In Progress'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 