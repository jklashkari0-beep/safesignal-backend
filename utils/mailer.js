const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject: ` EMERGENCY: ${victimName} needs help`,
      html: `
        <div style="font-family:sans-serif">
          <h2 style="color:red"> Emergency SOS Alert</h2>

          <p><b>${victimName}</b> needs immediate help.</p>

          <p><b>Phone:</b> ${victimPhone || "Not Available"}</p>

          <p>
            <b>Location:</b><br>
            Latitude: ${lat}<br>
            Longitude: ${lng}
          </p>

          <p>
            <a href="${mapsUrl}">
              Open Live Location
            </a>
          </p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);

    console.log("Email sent successfully:", response[0].statusCode);
  } catch (err) {
    console.error("SENDGRID ERROR:");
    console.error(err.response?.body || err.message);
  }
}

module.exports = { sendSOSEmail };