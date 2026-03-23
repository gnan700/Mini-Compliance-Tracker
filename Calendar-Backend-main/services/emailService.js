const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

const sendReminderEmail = async (event, recipient) => {
  console.log('Attempting to send email to:', recipient);
  console.log('Event details:', {
    heading: event.heading,
    dueDate: event.dueDate,
    status: event.status
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: `Reminder: ${event.heading} - Due Soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Compliance Event Reminder</h2>
        <p>This is a reminder about the following compliance event:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">${event.heading}</h3>
          <p><strong>Description:</strong> ${event.description}</p>
          <p><strong>Due Date:</strong> ${new Date(event.dueDate).toLocaleString()}</p>
          <p><strong>Status:</strong> ${event.status}</p>
          ${event.notes ? `<p><strong>Notes:</strong> ${event.notes}</p>` : ''}
        </div>

        <p>Please take necessary action to ensure compliance with this requirement.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated reminder from Comply's Smart Compliance Scheduler.</p>
        </div>
      </div>
    `
  };

  try {
    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendReminderEmail
};