const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email details
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'aasthajainokok@gmail.com',
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
