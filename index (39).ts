import {db} from "../db";
export async function unifiedSearch(query:string,limit=20){
  const sql=db();
  const q=query.trim();
  if(q.length<2)return [];
  return sql`
    SELECT id,'SOURCE' AS entity_type,slug,title,source_type AS summary
    FROM sources
    WHERE review_status='APPROVED' AND (title ILIKE ${'%'+q+'%'} OR metadata::text ILIKE ${'%'+q+'%'})
    UNION ALL
    SELECT id,'THEME',slug,title,description
    FROM themes
    WHERE status='PUBLISHED' AND (title ILIKE ${'%'+q+'%'} OR description ILIKE ${'%'+q+'%'})
    LIMIT ${limit}
  `;
}
