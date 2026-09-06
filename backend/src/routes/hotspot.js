const express = require("express")
const router = express.Router()
const pool = require("../db/pool")

router.get("/hotspot", async(req, res) => {
  try {
   const result = await pool.query(
     `SELECT id, datetime,
        ROUND((EXTRACT(EPOCH FROM (now() - datetime)) / 3600)::numeric) AS hours,
        confidence, satellite, ST_AsGeoJSON(geom)::json AS geometry
      FROM hotspots
      WHERE ST_Within(geom, ST_MakeEnvelope(129, -26, 138, -11, 4326))`
   )
   const data = result.rows;
   res.json(data);
  }
  catch (error) {
    console.error("Error fetching hotspot data:", error);
    res.status(500).json({ error: "Failed to fetch hotspot data" });
  }
})

module.exports = router