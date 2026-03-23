const { sendReminderEmail } = require('./emailService');
const Event = require('../models/Event');

const checkReminders = async () => {
  try {
    const now = new Date();
    const events = await Event.find({
      'reminders.time': { $lte: now },
      'reminders.sent': false
    });

    for (const event of events) {
      for (const reminder of event.reminders) {
        if (!reminder.sent && reminder.time <= now) {
          const emailPromises = event.peopleInvolved.map(recipient =>
            sendReminderEmail(event, recipient)
          );

          const results = await Promise.all(emailPromises);
          const allEmailsSent = results.every(result => result === true);

          if (allEmailsSent) {
            reminder.sent = true;
            await event.save();
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

const startReminderService = () => {
  checkReminders();
  setInterval(checkReminders, 5000);
  setInterval(() => {
    const now = new Date();
    if (now.getSeconds() === 0) {
      checkReminders();
    }
  }, 1000);
};

module.exports = {
  startReminderService
};