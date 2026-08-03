const nodemailer = require("nodemailer");

async function sendSOSEmail({
  to,
  victimName,
  victimPhone,
  lat,
  lng,
  mapsUrl,
}) {
  if (!to) {
    console.log("No email address found");
    return;
  }

  try {
    console.log("Sending SOS email to:", to);

    // Render Environment Check
    console.log("EMAIL USER:", process.env.EMAIL_USER);
    console.log("EMAIL PASS:", process.env.EMAIL_PASS ? "FOUND" : "MISSING");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    console.log("SMTP connection successful");

    await transporter.sendMail({
      from: {
        name: "SafeSignal SOS",
        address: process.env.EMAIL_USER,
      },

      to: to,

      subject: `Emergency SOS Alert - ${victimName}`,

      html: `
      <html>
      <body style="font-family: Arial, sans-serif; padding:20px">

        <h2 style="color:red;">
          Emergency SOS Alert
        </h2>

        <p>
          <b>${victimName}</b> has triggered an SOS alert.
        </p>

        <p>
          <b>Phone:</b> ${victimPhone || "Not Available"}
        </p>

        <p>
          <b>Latitude:</b> ${lat}
        </p>

        <p>
          <b>Longitude:</b> ${lng}
        </p>

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

      </body>
      </html>
      `,

      text: `
Emergency SOS Alert

${victimName} has triggered SOS.

Phone: ${victimPhone || "Not Available"}

Location:
${mapsUrl}
      `,
    });

    console.log("Email sent successfully to:", to);

  } catch (err) {
    console.error("EMAIL SEND ERROR:");
    console.error(err);
  }
}

module.exports = { sendSOSEmail };