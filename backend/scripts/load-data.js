require("dotenv").config()
const fs = require("fs")
const path = require("path")
const pool = require("../src/db/pool")



async function loadData() {
  const raw = fs.readFileSync(path.join(__dirname, "../data/nt_hotspots_sample.geojson"), "utf8")
  const data = JSON.parse(raw)

  for (const feature of data.features) {
    await pool.query(
      `INSERT INTO hotspots (datetime, hours, confidence, satellite, geom)
       VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))`,
      [
        feature.properties.datetime,
        feature.properties.hours,
        feature.properties.confidence,
        feature.properties.satellite,
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ]
    )
  }

  console.log("Data loaded successfully")
  await pool.end()
}

loadData()
