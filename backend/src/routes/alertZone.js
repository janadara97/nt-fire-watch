const express = require("express")
const router = express.Router()
const pool = require("../db/pool")
const {getAuth} = require("@clerk/express")

router.post("/alert-zones", async (req, res) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { latitude, longitude, radiusMeters, notifyEmail } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO alert_zones (user_id, center, radius_meters, notify_email)
       VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5)
       RETURNING id`,
      [userId, longitude, latitude, radiusMeters, notifyEmail ?? true]
    )
    res.status(201).json({ id: result.rows[0].id })
  } catch (error) {
    console.error("Error creating alert zone:", error)
    res.status(500).json({ error: "Failed to create alert zone" })
  }
})

router.get("/alert-zones", async (req, res) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const result = await pool.query(
      `SELECT id, ST_X(center) AS longitude, ST_Y(center) AS latitude, radius_meters, notify_email
       FROM alert_zones WHERE user_id = $1`,
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching alert zones:", error)
    res.status(500).json({ error: "Failed to fetch alert zones" })
  }
})

router.patch("/alert-zones/:id", async (req, res) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { notifyEmail, radiusMeters } = req.body
  try {
    const result = await pool.query(
      `UPDATE alert_zones
       SET notify_email = COALESCE($1, notify_email),
           radius_meters = COALESCE($2, radius_meters)
       WHERE id = $3 AND user_id = $4
       RETURNING id`,
      [notifyEmail, radiusMeters, req.params.id, userId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alert zone not found" })
    }
    res.json({ id: result.rows[0].id })
  } catch (error) {
    console.error("Error updating alert zone:", error)
    res.status(500).json({ error: "Failed to update alert zone" })
  }
})

router.delete("/alert-zones/:id", async (req, res) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const result = await pool.query(
      `DELETE FROM alert_zones WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, userId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alert zone not found" })
    }
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting alert zone:", error)
    res.status(500).json({ error: "Failed to delete alert zone" })
  }
})

module.exports = router
