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

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "SafeSignal SOS",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: ` Emergency SOS Alert - ${victimName}`,
        htmlContent: `
          <html>
          <body style="font-family:Arial,sans-serif;padding:20px">
            <h2 style="color:red;"> Emergency SOS Alert</h2>

            <p><b>${victimName}</b> has triggered an SOS alert.</p>

            <p><b>Phone:</b> ${victimPhone || "Not Available"}</p>

            <p><b>Latitude:</b> ${lat}</p>

            <p><b>Longitude:</b> ${lng}</p>

            <p>
              <a href="${mapsUrl}" target="_blank">
                 Open Live Location
              </a>
            </p>

            <hr>

            <p>This email was sent automatically by <b>SafeSignal</b>.</p>
          </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Brevo Email Sent:", response.status);
  } catch (err) {
    console.error("BREVO ERROR:");
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendSOSEmail };