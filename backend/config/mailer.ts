import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "softqivo@gmail.com",
    pass: "ggqn wiha cdio upqq",
  },
});

export default transporter;