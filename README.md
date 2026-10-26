# Knowlege.org Phase 2

## Run
```powershell
Copy-Item .env.example .env
docker compose up -d postgres
npm install
psql $env:DATABASE_URL -f database/schema.sql
npm run seed
npm run typecheck
npm run dev
```
Open `http://localhost:3000`.

## Safety
- No copyrighted Qur'an editions, translations, tafsir, hadith, audio or video are bundled.
- AI research is disabled by default.
- Religious content and charity listings require human review.
- `/admin` must be protected before deployment.
- Newsletter production requires double opt-in and unsubscribe workflows.
