# Cloudflare deployment

Recommended production topology:

- Cloudflare DNS, WAF, CDN and Turnstile.
- Next.js on a supported Cloudflare adapter/runtime or Node host behind Cloudflare.
- PostgreSQL on Neon or Supabase.
- R2 for licensed documents, images and permitted audio.
- Secrets stored in Cloudflare/GitHub secret stores, never committed.

Before deployment, verify current Cloudflare Next.js compatibility and adapter instructions. Web search was unavailable when this package was produced, so no current adapter version is hardcoded.
