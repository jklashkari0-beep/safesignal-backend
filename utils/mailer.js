const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
}

async function sendSOSEmail({ to, victimName, victimPhone, lat, lng, mapsUrl }) {
  console.log("Sending email to:", to);

  const t = getTransporter();

  if (!t || !to) {
    console.log("Transporter not configured or email missing");
    return;
  }

  try {
  const info = await t.sendMail({
    from: `"SafeSignal Alert" <${process.env.EMAIL_USER}>`,
    to,
    subject: `EMERGENCY: ${victimName} needs help`,
    html: `
      <div style="font-family:sans-serif">
        <h2>Emergency SOS Alert</h2>
        <p>${victimName} needs help.</p>
        <a href="${mapsUrl}">Open Google Maps</a>
      </div>
    `,
  });

  console.log("Email sent successfully:", info.response);
} catch (err) {
  console.error("EMAIL ERROR:");
  console.error(err);
}
}
module.exports = { sendSOSEmail };