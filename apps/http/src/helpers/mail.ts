import { getTransporter } from "../config/mail.js";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await getTransporter().sendMail({
      from: `"StreamIt" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
