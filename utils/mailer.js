const axios = require("axios");

async function sendSOSEmail({
  to,
  victimName,
  victimPhone,
  lat,
  lng,
  mapsUrl,
}) {
  if (!to) return;

  console.log("Sending SOS email to:", to);
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "MISSING");
  console.log(
    "BREVO_API_KEY:",
    process.env.BREVO_API_KEY ? "FOUND" : "MISSING"
  );

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_USER,
          name: "SafeSignal SOS",
        },
        to: [{ email: to }],
        subject: `Emergency SOS Alert - ${victimName}`,
        htmlContent: `
          <h2>Emergency SOS Alert</h2>
          <p><b>${victimName}</b> has triggered an SOS.</p>
          <p><b>Phone:</b> ${victimPhone || "Not Available"}</p>
          <p><a href="${mapsUrl}">Open Live Location</a></p>
        `,
        textContent: `
Emergency SOS Alert

${victimName} has triggered an SOS.

Phone: ${victimPhone || "Not Available"}

${mapsUrl}
        `,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    console.log("Brevo Email Sent:", response.status);
    console.log(response.data);
  } catch (err) {
    console.error("BREVO ERROR:");
    console.error(err.response?.status);
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendSOSEmail };