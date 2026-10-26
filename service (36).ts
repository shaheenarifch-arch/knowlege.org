import{db}from"../db";
export async function publicCourses(){return db()`SELECT id,slug,title,description,language,level FROM courses WHERE status='PUBLISHED' ORDER BY title`}
