import{db}from"../db";
export async function listCollections(userId:string){return db()`SELECT id,title,description,private,updated_at FROM research_collections WHERE user_id=${userId} ORDER BY updated_at DESC`}
export async function createCollection(userId:string,title:string,description?:string){return db()`INSERT INTO research_collections(id,user_id,title,description) VALUES(gen_random_uuid(),${userId},${title},${description??null}) RETURNING *`}
