import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: "aasthajainokok@gmail.com",
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: "Email sent successfully!" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { error: "Failed to send email." },
            { status: 500 }
        );
    }
}
