# Knowlege.org Phase 7

Global Knowledge Network code foundation.

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
npm install
npm run typecheck
npm run test
npm run dev
```

This is an implementation foundation. It is not ready for public religious answers or open community posting until approved sources, authentication, moderation and migrations are connected.

## Safe Community Upgrade
Adds moderated discussions, Q&A, communities, interactive sessions, Islamic calendar/events, and multi-stage guardrails. See `docs/COMMUNITY_GUARDRAILS.md`.
