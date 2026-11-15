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

## Guest posts ("Write for us")

Writers submit at [/write-for-us](https://knowlege.org/write-for-us) and track progress at [/write-for-us/status](https://knowlege.org/write-for-us/status). Editors review at [/admin/guest-posts](https://knowlege.org/admin/guest-posts). Approved posts go live at `/blog/guest/<slug>` straight from D1, with no redeploy.

**Flow and emails**

| Step | Writer gets | Editor gets |
|---|---|---|
| Submitted | Tracking code + status link | Full summary + "Review it now" link |
| Start review | "Your article is in review" | — |
| Request changes (note required) | Editor's note + private "Edit and resubmit" link | — |
| Resubmitted | Confirmation | "Guest post resubmitted" |
| Approve & publish | Live link | — |
| Decline | Reason (if given) | — |
| Waiting > 3 days | — | Daily reminder (GitHub Action) |

**One-time setup ($0)**

1. Create the tables: `npx wrangler d1 execute newsletter --remote --file=database/d1-guest-posts.sql`
2. Email: create a free [Resend](https://resend.com) account (free plan, 3,000 emails/month), [verify the knowlege.org domain](https://resend.com/docs/dashboard/domains/introduction) (add its DNS records in Cloudflare), create an API key, then `npx wrangler secret put RESEND_API_KEY`.
3. Lock `/admin`: in Cloudflare Zero Trust, [add a self-hosted Access application](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-public-app/) for `knowlege.org/admin*` and `knowlege.org/api/admin*`, allowing only the editor email. The code also checks the signed-in email against `GUEST_POST_EDITOR_EMAIL` (in `wrangler.jsonc`).
4. Reminders: pick a random secret, then `npx wrangler secret put GUEST_POST_CRON_SECRET` and add the same value as the GitHub repo secret `GUEST_POST_CRON_SECRET`.
5. Optional spam check: create a free [Turnstile widget](https://developers.cloudflare.com/turnstile/get-started/), add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to the build environment and `npx wrangler secret put TURNSTILE_SECRET_KEY`.

Until step 2 is done, emails are skipped (and logged); writers still see every status on the status page.
