const express = require("express")
const cors = require("cors")
const cron = require("node-cron")
const hotspotRoute = require("./routes/hotspot")
const alertZoneRoute = require("./routes/alertZone")
const {clerkMiddleware} = require("@clerk/express")
const {ingestHotspots} = require("./services/hotspotIngestion")

const app = express()
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send("NT FireWatch API is running")
})

app.use("/api", hotspotRoute)
app.use("/api", alertZoneRoute)

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

ingestHotspots().catch((error) => console.error("DEA ingestion failed:", error))
cron.schedule("*/15 * * * *", () => {
  ingestHotspots().catch((error) => console.error("DEA ingestion failed:", error))
})