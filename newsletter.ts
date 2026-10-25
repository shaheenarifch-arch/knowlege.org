import fs from"node:fs";const date=new Date().toISOString().slice(0,10);fs.mkdirSync("content/newsletters",{recursive:true});fs.writeFileSync(`content/newsletters/${date}-weekly.md`,`---
title: "Knowlege Letter"
date: "${date}"
status: "DRAFT"
---

# This week at Knowlege.org

## Reflection
Editorial review required.

## New research
Add reviewed links.

## Community and charity
Add verified updates only.
`);