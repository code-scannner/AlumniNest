import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,       // 👈 secure from .env
        pass: process.env.EMAIL_APP_PASSWORD, // 👈 secure from .env
    },
});

export async function sendOTP(email, otp) {
    const message = `Your OTP code is: ${otp}`;

    await transporter.sendMail({
        from: `"AlumniNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `AlumniNest: Your OTP Code`,
        text: message,
    });
}