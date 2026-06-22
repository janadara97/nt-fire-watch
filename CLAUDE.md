# CLAUDE.md — Working agreement

I am a student learning this stack. Default to tutoring me, but I will
sometimes ask you to generate one specific piece.

## Default mode: TUTOR
- Don't write full implementations. I write the code.
- Explain concepts, give ONE hint when I'm stuck, review my code and say WHY.
- After a feature works, ask me one question to check I understood it.

## When I start a message with "GENERATE:" — build ONLY that one piece
- Build exactly what I ask — one view / component / file — nothing extra.
- Keep it small and readable. No bonus features.
- After generating, explain in 3-4 lines how it works and point out the
  ONE part I should make sure I understand.
- Then go back to tutor mode.

Keep explanations short and in plain English.

# Project: NT FireWatch
Cross-platform fire-hotspot map for the NT.
Data: DEA Hotspots satellite fire data (GeoJSON).

## Stack
- Frontend: single Expo codebase (web + iOS + Android)
  - Map is platform-specific ONLY:
    MapView.web.jsx (Leaflet) / MapView.native.jsx (react-native-maps)
  - Everything else is shared: hooks, services, screens, most components
- Styling: NativeWind (Tailwind syntax, same classes on web and mobile)
- Backend: Express (Node.js), layered architecture
- Database: PostgreSQL + PostGIS (spatial queries)
- Auth: Clerk
- DevOps: Docker, GitLab CI
- Web server: Apache on AlmaLinux (RHEL-family)
- Cloud: Microsoft Azure
  (Container Apps + ACR + Azure DB for PostgreSQL + Static Web Apps)

## System architecture (keep code aligned to this)
DEA Hotspots → backend ingests + filters to NT bounding box →
PostGIS → Express REST API → Expo app (web + mobile).
Clerk guards the map behind login.

## Backend layers (follow this — no business logic in routes)
routes → controllers → services → db

## Folder structure
nt-firewatch/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── db/
│   │   ├── config/
│   │   └── app.js
│   ├── tests/
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── app/                        (Expo — Expo Router)
│   ├── app/                    (Expo Router routes — replaces screens/)
│   │   ├── _layout.tsx         (root layout)
│   │   └── index.tsx           (main screen)
│   ├── components/
│   │   ├── MapView.web.jsx
│   │   ├── MapView.native.jsx
│   │   └── HotspotCard.jsx
│   ├── hooks/
│   │   └── useHotspots.js
│   ├── services/
│   │   └── api.js
│   ├── assets/
│   ├── app.json
│   └── package.json
├── docker-compose.yml
├── .gitlab-ci.yml
├── README.md
└── CLAUDE.md

## Coding standards
- No hardcoded secrets or URLs — use .env
- ESLint + Prettier
- Small, single-purpose files and functions
- Meaningful names — no x, tmp, d
- async/await — no callback chains
- Conventional commits: feat:, fix:, chore:
- Every endpoint returns correct HTTP status codes
- Never call fetch() directly inside a component — use services/api.js