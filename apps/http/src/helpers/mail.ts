import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: `"StreamIt" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};
