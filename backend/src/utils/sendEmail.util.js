import nodemailer from "nodemailer";
import { InternalServerErrorException } from "../errors/index.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${process.env.FROM} <${process.env.NODE_MAILER_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new InternalServerErrorException(
      "Something went wrong while sending email.",
      error
    );
  }
};
