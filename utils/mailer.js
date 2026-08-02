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

  await t.sendMail({
    from: `"SafeSignal Alert" <${process.env.EMAIL_USER}>`,
    to,
    subject: ` EMERGENCY: ${victimName} needs help`,
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2 style="color: #E8384F;">Emergency SOS Alert</h2>
        <p><strong>${victimName}</strong> (${victimPhone || 'no phone on file'}) has triggered an emergency alert and listed you as an emergency contact.</p>
        <p><strong>Live location:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
        <p><a href="${mapsUrl}" style="display:inline-block;padding:10px 16px;background:#E8384F;color:#fff;text-decoration:none;border-radius:6px;">Open location in Google Maps</a></p>
        <p style="color: #888; font-size: 12px;">Sent automatically by SafeSignal.</p>
      </div>
    `,
  });

  console.log("Email sent successfully:", to);
}
module.exports = { sendSOSEmail };