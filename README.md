# Knowlege.org Phase 10 Dataset Ingestion

This package imports legally obtained, approved datasets. It contains **no Qur'an, translation, tafsir, hadith or scholar dataset itself**.

## Setup
```powershell
Copy-Item .env.example .env
docker compose up -d postgres
npm install
psql $env:DATABASE_URL -f database/schema.sql
npm run typecheck
npm test
```

## Add a dataset
1. Place files under the matching `datasets/` folder.
2. Copy an example manifest to `datasets/manifests/<dataset>.json`.
3. Complete source, license, attribution, version and file fields.
4. Set review status to `APPROVED` only after authorization and review.
5. Run with `IMPORT_DRY_RUN=true` first.

```powershell
npm run validate
npm run import:quran
npm run report
```

Set `IMPORT_DRY_RUN=false` only after the report is clean and database backups exist.
