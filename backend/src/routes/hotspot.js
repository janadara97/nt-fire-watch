const express = require("express")
const router = express.Router()
const pool = require("../db/pool")



// Then you write it. In routes/hotspots.js, change the handler so it:

// Fetches a GeoJSON hotspot file (use your nt_hotspots_sample.geojson served locally, or the NASA FIRMS Australia GeoJSON for live data),
// Keeps only points inside the NT bounding box,
// Sends back the filtered FeatureCollection.
// GET /api/hotspots

router.get("/hotspot", async(req, res) => {
  try {
    //const response = await fetch("https://firms.modaps.eosdis.nasa.gov/active_fire/c6/csv/MODIS_C6_Australia_24h.csv")
   //const raw = fs.readFileSync(path.join(__dirname, "../../data/nt_hotspots_sample.geojson"), "utf8")
   const result = await pool.query("SELECT id, datetime, hours, confidence, satellite, ST_AsGeoJSON(geom)::json AS geometry FROM hotspots WHERE ST_Within(geom, ST_MakeEnvelope(129, -26, 138, -11, 4326))")
   const data = result.rows;
   res.json(data);
  }
  catch (error) {
    console.error("Error fetching hotspot data:", error);
    res.status(500).json({ error: "Failed to fetch hotspot data" });
  }
})

module.exports = router