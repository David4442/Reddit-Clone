import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

export async function sendEmail(to: string, html: string) {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: to, // list of receivers
    subject: "Change password ", // Subject line
    html // plain text body
  });

  console.log("URL to email: %s", nodemailer.getTestMessageUrl(info));
}
