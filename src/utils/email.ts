import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

const { APP_EMAIL, APP_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD
  }
});

export default async function sendEmail(emailOptions: EmailOptions): Promise<boolean> {
  try {
    const sendInfo = await transport.sendMail({ from: `Admin PIPOT <${APP_EMAIL}>`, ...emailOptions });
    console.log(`Email sent: ${sendInfo.response}`);
    return true;
  } catch (error) {
    console.log(`Couldn't send email: ${error}`);
    return false;
  }
}