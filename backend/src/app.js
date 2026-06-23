const express = require("express")
const cors = require("cors")
const hotspotRoute = require("./routes/hotspot")
const {clerkMiddleware} = require("@clerk/express")

const app = express()
app.use(cors())
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send("NT FireWatch API is running")
})

app.use("/api", hotspotRoute)

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})