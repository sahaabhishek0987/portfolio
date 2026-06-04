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
app.get('/', (req, res) => {
  res.send('Portfolio backend is running securely!');
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
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#f9f9f9;border-radius:8px;overflow:hidden;">
          <div style="background:#0a0a0f;padding:24px 32px;">
            <h2 style="color:#e8ff47;margin:0;font-size:22px;">Hey ${name} 👋</h2>
          </div>
          <div style="padding:32px;">
            <p style="color:#333;line-height:1.8;">
              Thanks for getting in touch! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.
            </p>
            <p style="color:#555;line-height:1.8;margin-top:16px;">
              In the meantime, feel free to check out my projects or connect with me on LinkedIn and GitHub.
            </p>
            <p style="color:#555;line-height:1.8;margin-top:16px;">
             GitHub - https://github.com/sahaabhishek0987
            </p>            
            <p style="color:#555;line-height:1.8;margin-top:16px;">
              Instagram - https://www.instagram.com/abhishekkkkkkkkk_?igsh=eXcwOG9scHJwdWpq
            </p>
            <p style="color:#555;line-height:1.8;margin-top:16px;">
              LinkedIn - https://www.linkedin.com/in/abhishek-saha-45047a2b5
            </p>            
            <p style="margin-top:32px;color:#333;">— Abhishek Saha</p>
          </div>
        </div>
      `,
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
