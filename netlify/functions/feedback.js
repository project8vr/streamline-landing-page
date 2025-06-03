const nodemailer = require('nodemailer');

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { like, wish } = JSON.parse(event.body || "{}");
    if ((!like && !wish)) {
      return { statusCode: 400, body: "Missing feedback" };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: '"Stream2Night Feedback" <no-reply@yourdomain.com>',
      to: 'liam@pathtomvp.com',
      subject: 'New Stream2Night Feedback',
      text: `What they like/don't like: ${like}\nWhat they want: ${wish}`
    });

    return { statusCode: 200, body: "Sent" };
  } catch (err) {
    return { statusCode: 500, body: "Email send failed: " + err.message };
  }
};
