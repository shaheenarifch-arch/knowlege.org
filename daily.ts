import fs from"node:fs";import path from"node:path";const date=new Date().toISOString().slice(0,10);const topics=["Mercy and service","Knowledge and reflection","Justice and responsibility","Family and community","Ethics in modern life","Stewardship and charity"];const topic=topics[new Date().getUTCDate()%topics.length]!;const dir="content/drafts";fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,`${date}-${topic.toLowerCase().replaceAll(" ","-")}.md`);if(!fs.existsSync(file))fs.writeFileSync(file,`---
title: "${topic}"
date: "${date}"
status: "DRAFT"
reviewRequired: true
---

# ${topic}

## Source notes

Add verified Qur'anic, tafsir and hadith references before publication.

## Draft

Editorial draft placeholder.
`);console.log(file);