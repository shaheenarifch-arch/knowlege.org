import fs from"node:fs";const d=new Date().toISOString().slice(0,10);fs.mkdirSync("content/newsletters",{recursive:true});fs.writeFileSync(`content/newsletters/${d}-digest.md`,`---
title: "Knowlege Weekly Digest"
date: "${d}"
status: "DRAFT"
---

# Weekly Digest

Reviewed links only.
`);