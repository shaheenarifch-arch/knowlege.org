import{db}from"../db";
export async function health(){const started=Date.now();try{await db()`SELECT 1`;return{status:"healthy",database:"available",latencyMs:Date.now()-started}}catch(e){return{status:"degraded",database:"unavailable",latencyMs:Date.now()-started,error:e instanceof Error?e.message:"unknown"}}}
