import fs from"node:fs";const d=new Date().toISOString().slice(0,10);const dir="content/drafts";fs.mkdirSync(dir,{recursive:true});const f=`${dir}/${d}-reflection.md`;if(!fs.existsSync(f))fs.writeFileSync(f,`---
title: "Daily Reflection"
date: "${d}"
status: "DRAFT"
reviewRequired: true
---

# Daily Reflection

## Source notes
Add verified Qur'anic, tafsir and hadith references before publication.
`);console.log(f);