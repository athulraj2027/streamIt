import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

export const getTransporter = () => {
  if (!_transporter) {
    console.log("SMTP DEBUG:", {
      host: process.env.SMTP_HOST,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? "LOADED" : "MISSING",
    });

    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
  }
  return _transporter;
};
