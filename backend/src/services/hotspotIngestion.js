const pool = require("../db/pool")
const {clerkClient} = require("@clerk/express")
const {sendFireAlertEmail} = require("./emailService")

const DEA_HOTSPOTS_URL = process.env.DEA_HOTSPOTS_URL

async function notifyMatchingZones(hotspot) {
  const { rows: zones } = await pool.query(
    `SELECT user_id FROM alert_zones
     WHERE notify_email = true
       AND ST_DWithin(
         center::geography,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         radius_meters
       )`,
    [hotspot.longitude, hotspot.latitude]
  )

  for (const zone of zones) {
    try {
      const user = await clerkClient.users.getUser(zone.user_id)
      const email = user.primaryEmailAddress?.emailAddress
      if (email) {
        await sendFireAlertEmail(email, hotspot)
      }
    } catch (error) {
      console.error(`Failed to notify user ${zone.user_id}:`, error)
    }
  }
}

async function ingestHotspots() {
  const response = await fetch(DEA_HOTSPOTS_URL)
  if (!response.ok) {
    throw new Error(`DEA Hotspots request failed: ${response.status}`)
  }
  const { features } = await response.json()

  const ntHotspots = features.filter(
    (feature) => feature.properties.australian_state?.trim() === "NT"
  )

  let insertedCount = 0
  for (const feature of ntHotspots) {
    const { id, datetime, hours_since_hotspot, confidence, satellite } = feature.properties
    const [longitude, latitude] = feature.geometry.coordinates

    const result = await pool.query(
      `INSERT INTO hotspots (datetime, hours, confidence, satellite, source_id, geom)
       VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))
       ON CONFLICT (source_id) DO NOTHING
       RETURNING id`,
      [datetime, Math.round(hours_since_hotspot), confidence, satellite, id, longitude, latitude]
    )

    if (result.rowCount > 0) {
      insertedCount++
      await notifyMatchingZones({ longitude, latitude, confidence, satellite })
    }
  }

  console.log(`DEA ingestion: ${ntHotspots.length} NT hotspots found, ${insertedCount} new rows inserted`)
  return insertedCount
}

module.exports = { ingestHotspots }
