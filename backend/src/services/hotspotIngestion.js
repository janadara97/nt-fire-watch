const pool = require("../db/pool")

const DEA_HOTSPOTS_URL = process.env.DEA_HOTSPOTS_URL

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
       ON CONFLICT (source_id) DO NOTHING`,
      [datetime, Math.round(hours_since_hotspot), confidence, satellite, id, longitude, latitude]
    )
    insertedCount += result.rowCount
  }

  console.log(`DEA ingestion: ${ntHotspots.length} NT hotspots found, ${insertedCount} new rows inserted`)
  return insertedCount
}

module.exports = { ingestHotspots }
