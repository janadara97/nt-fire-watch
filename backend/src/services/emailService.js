const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
})

async function sendFireAlertEmail(toEmail, hotspot) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "NT FireWatch: new fire detected near your alert zone",
    text: `A new hotspot was detected near (${hotspot.latitude}, ${hotspot.longitude}).\nConfidence: ${hotspot.confidence}\nSatellite: ${hotspot.satellite}`,
  })
}

module.exports = { sendFireAlertEmail }
