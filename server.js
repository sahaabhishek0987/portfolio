require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const mailOptionsToOwner = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };
    await transporter.sendMail(mailOptionsToOwner);
    const autoReplyOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      text: `Hi ${name},\n\nThank you for contacting me through my portfolio! I have received your message and will get back to you as soon as possible.\n\nHere is a copy of what you sent:\n\n"${message}"\n\nBest regards,\nAbhishek Saha`,
    };
    await transporter.sendMail(autoReplyOptions);
    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});