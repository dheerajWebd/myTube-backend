import nodemailer from "nodemailer";

export const emailSend = async (from, to, subject, html) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.email_password,
    },
  });

  const mailOption = {
    from,
    to,
    subject,
    html,
  };

  const sent = await transpoter.sendMail(mailOption, function (error, info) {
    if (error) {
      return error;
    } else {
      return info;
    }
  });
};
