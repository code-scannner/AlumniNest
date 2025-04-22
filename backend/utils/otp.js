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

export async function sendOTP(email, name, otp) {

    await transporter.sendMail({
        from: `"AlumniNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your AlumniNest OTP Code",
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2>Verify Your AlumniNest Account</h2>
      <p>Hi ${name},</p>
      <h3 style="background-color: #f3f3f3; padding: 10px 20px; display: inline-block; border-radius: 6px;">${otp}</h3>
      <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p>If you didn't request this, simply ignore this message.</p>
      <hr />
   </div>
 `,

    });
}
