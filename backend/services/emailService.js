import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
  console.warn(
    "⚠️ EMAIL_USER or EMAIL_APP_PASSWORD is missing from environment variables."
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  if (!to) {
    throw new Error("Recipient email is required.");
  }

  const info = await transporter.sendMail({
    from: `"NextTGrains" <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

export const verifyEmailTransporter = async () => {
  try {
    await transporter.verify();

    console.log("✅ Email transporter is ready.");
    return true;
  } catch (error) {
    console.error(
      "❌ Email transporter verification failed:",
      error.message
    );

    return false;
  }
};