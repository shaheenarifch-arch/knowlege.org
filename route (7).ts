import{NextResponse}from"next/server";import{db}from"../../../lib/db";
export async function GET(){try{return NextResponse.json({items:await db()`SELECT id,slug,title,description,duration_days FROM study_plans WHERE status='PUBLISHED' ORDER BY title`})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"STUDY_PLAN_FAILED"},{status:500})}}
