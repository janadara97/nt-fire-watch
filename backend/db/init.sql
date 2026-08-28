CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS hotspots (
  id         SERIAL PRIMARY KEY,
  datetime   TIMESTAMP,
  hours      INTEGER,
  confidence TEXT,
  satellite  TEXT,
  source_id  BIGINT UNIQUE,
  geom       geometry(Point, 4326)
);

CREATE TABLE IF NOT EXISTS alert_zones (
  id            SERIAL PRIMARY KEY,
  user_id       TEXT NOT NULL,
  center        geometry(Point, 4326) NOT NULL,
  radius_meters INTEGER NOT NULL,
  notify_email  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alert_zones_user_id ON alert_zones(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_zones_center ON alert_zones USING GIST(center);

INSERT INTO hotspots (datetime, hours, confidence, satellite, geom) VALUES
  ('2026-06-20T03:10:00Z', 1,  'high',   'Himawari-9', ST_SetSRID(ST_MakePoint(130.84, -12.46), 4326)),
  ('2026-06-20T02:40:00Z', 2,  'high',   'NOAA-20',    ST_SetSRID(ST_MakePoint(131.13, -12.58), 4326)),
  ('2026-06-20T01:05:00Z', 3,  'high',   'Suomi-NPP',  ST_SetSRID(ST_MakePoint(132.83, -12.67), 4326)),
  ('2026-06-19T23:50:00Z', 5,  'medium', 'Aqua',       ST_SetSRID(ST_MakePoint(132.26, -14.46), 4326)),
  ('2026-06-19T22:30:00Z', 6,  'medium', 'NOAA-20',    ST_SetSRID(ST_MakePoint(130.69, -13.75), 4326)),
  ('2026-06-19T20:15:00Z', 9,  'medium', 'Himawari-9', ST_SetSRID(ST_MakePoint(131.83, -13.82), 4326)),
  ('2026-06-19T17:40:00Z', 12, 'low',    'Aqua',       ST_SetSRID(ST_MakePoint(133.07, -14.92), 4326)),
  ('2026-06-19T15:20:00Z', 14, 'medium', 'Suomi-NPP',  ST_SetSRID(ST_MakePoint(136.30, -16.07), 4326)),
  ('2026-06-19T14:05:00Z', 15, 'high',   'NOAA-21',    ST_SetSRID(ST_MakePoint(134.50, -12.90), 4326)),
  ('2026-06-19T11:30:00Z', 18, 'medium', 'Himawari-9', ST_SetSRID(ST_MakePoint(136.78, -12.18), 4326)),
  ('2026-06-19T08:10:00Z', 22, 'low',    'Aqua',       ST_SetSRID(ST_MakePoint(131.00, -15.60), 4326)),
  ('2026-06-19T05:45:00Z', 25, 'medium', 'NOAA-20',    ST_SetSRID(ST_MakePoint(133.54, -17.55), 4326)),
  ('2026-06-18T23:20:00Z', 31, 'low',    'Suomi-NPP',  ST_SetSRID(ST_MakePoint(134.19, -19.65), 4326)),
  ('2026-06-18T20:00:00Z', 34, 'low',    'Aqua',       ST_SetSRID(ST_MakePoint(135.80, -19.20), 4326)),
  ('2026-06-18T16:30:00Z', 38, 'low',    'NOAA-21',    ST_SetSRID(ST_MakePoint(133.88, -23.70), 4326)),
  ('2026-06-18T12:10:00Z', 44, 'low',    'Himawari-9', ST_SetSRID(ST_MakePoint(130.99, -25.24), 4326));
