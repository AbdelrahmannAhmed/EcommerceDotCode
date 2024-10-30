// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from "nodemailer"

// Nodemailer
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export default sendEmail
