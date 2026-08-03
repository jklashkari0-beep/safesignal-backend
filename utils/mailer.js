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
      "https://comms.twilio.com/v1/Emails",
      {
        from: {
          address: `${process.env.TWILIO_ACCOUNT_SID}@twilio.email`,
          name: "SafeSignal SOS",
        },
        to: [
          {
            address: to,
          },
        ],
        content: {
          subject: ` EMERGENCY: ${victimName} needs help`,
          html: `
            <div style="font-family:Arial,sans-serif;padding:20px">
              <h2 style="color:red"> Emergency SOS Alert</h2>

              <p><b>${victimName}</b> has triggered an SOS.</p>

              <p><b>Phone:</b> ${victimPhone || "Not Available"}</p>

              <p><b>Latitude:</b> ${lat}</p>
              <p><b>Longitude:</b> ${lng}</p>

              <p>
                <a href="${mapsUrl}" target="_blank">
                 Open Live Location
                </a>
              </p>

              <hr>

              <p>
                This email was sent automatically by
                <b>SafeSignal Emergency System</b>.
              </p>
            </div>
          `,
        },
      },
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Twilio Email Sent:", response.status);
  } catch (err) {
    console.error("TWILIO EMAIL ERROR:");
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendSOSEmail };