# Architecture

NT FireWatch ingests near real-time satellite fire-hotspot data from Digital Earth Australia, stores it in a spatial database, and serves it to an interactive map behind authentication. Users can save alert zones and receive email notifications when a new hotspot appears nearby.

**Live:** [firewatch.chathura.com.au](https://firewatch.chathura.com.au)

## Overview

The whole system runs on a single Azure virtual machine (AlmaLinux, RHEL-family), orchestrated with Docker Compose. Three containers do the work: Apache serves the frontend and reverse-proxies the API, Express runs the backend and the ingestion job, and PostgreSQL with PostGIS stores the spatial data.

## Data flow

There are two separate journeys through the system.

**Ingestion (background, every 15 minutes)**

A `node-cron` job inside the Express container fetches the DEA Hotspots feed, filters records to the Northern Territory, and upserts them into PostGIS. Deduplication uses DEA's own numeric `id` as a unique `source_id` with `ON CONFLICT DO NOTHING`. After each run the job checks saved alert zones and sends email notifications for any new hotspot falling inside one.

**Request (when a user opens the app)**

The browser hits Apache over HTTPS. Apache serves the Expo web export as static files, and proxies any `/api/*` request through to the Express container. Express verifies the Clerk session token, queries PostGIS, and returns GeoJSON, which the Leaflet map renders as colour-coded hotspot markers.

Because the frontend and the API are served from the same origin, there is no CORS configuration — the reverse proxy handles it structurally.

## Components

| Layer      | Technology                  | Responsibility                                                     |
| ---------- | --------------------------- | ------------------------------------------------------------------ |
| Web server | Apache (httpd) on AlmaLinux | Serves the Expo web export, reverse-proxies `/api`, terminates TLS |
| Frontend   | Expo (React) + Leaflet      | Interactive hotspot map, alert-zone management                     |
| API        | Express (Node.js)           | REST endpoints, scheduled ingestion, alert detection, email        |
| Database   | PostgreSQL + PostGIS        | Spatial storage and queries                                        |
| Auth       | Clerk                       | User management, JWT verification middleware                       |
| Email      | Gmail SMTP via nodemailer   | Alert-zone notifications                                           |
| Analytics  | Power BI                    | Dashboard over the hotspot data                                    |

## Spatial data

Hotspots are stored as `geometry(Point, 4326)` — the standard GPS coordinate system. Two spatial patterns do most of the work:

**Bounding-box filtering** keeps the dataset to the Northern Territory:

```sql
SELECT ST_AsGeoJSON(geom)::json AS geometry, confidence, satellite
FROM hotspots
WHERE ST_Within(geom, ST_MakeEnvelope(129, -26, 138, -11, 4326));
```

**Radius matching** decides whether a new hotspot falls inside a user's alert zone:

```sql
SELECT * FROM alert_zones
WHERE ST_DWithin(center::geography, $1::geography, radius_meters);
```

The `::geography` cast is essential here. Without it PostGIS interprets `radius_meters` as degrees, where one degree is roughly 111 km.

Detection age is always computed at query time rather than stored, since a value written at insert goes stale immediately:

```sql
EXTRACT(EPOCH FROM (now() - datetime)) / 3600 AS hours_old
```

## Deployment

A Jenkins pipeline builds on push from GitHub: install dependencies, build the Expo web export, then deploy to the VM over SSH (`git pull` followed by `docker compose up -d --build`).

The Apache image uses a multi-stage Dockerfile — a Node stage builds the Expo web export, and the final AlmaLinux stage copies only the built `dist/` output alongside the Apache config. The result is a self-contained image with no build tooling or source left in it, and no dependency on a `dist/` folder existing on the host.

HTTPS uses Let's Encrypt via certbot in standalone mode, with pre/post hooks that stop and start the Apache container so port 80 is free for the ACME challenge. The SSL vhost lives on the VM host outside the repository and is pulled in with `IncludeOptional`, which keeps local development working over plain HTTP.

The Azure network security group allows ports 22, 80 and 443 only.

## Configuration

Environment variables are kept in `.env` files that are gitignored and maintained per environment. `backend/.env.example` documents the required keys.

Two values differ between local and production and are worth noting, since both have caused bugs:

- `DB_HOST` is `localhost` when connecting from the host machine, but `db` inside Docker Compose, where containers reach each other by service name.
- `EXPO_PUBLIC_API_URL` is an absolute `http://localhost:3000` in development, but empty in production so the frontend calls relative `/api/...` paths and Apache proxies them. An absolute URL here breaks the deployed app with mixed-content and CORS errors.

## Known limitations

- `MapView.native.jsx` is incomplete — the app is effectively web-only for now.
- Alert notifications are email only; push notifications are not implemented.
- `backend/Dockerfile` copies the full build context without a `.dockerignore`, so `.env` is baked into the image. This should be fixed before the image is published anywhere.
- The database schema in `db/init.sql` only applies to a fresh volume, so schema changes on a running deployment need manual migration.
