import {NextResponse}from"next/server";import{requireUser}from"../../../../lib/auth/session";
export async function GET(){try{await requireUser();return NextResponse.json({items:[]})}catch{return NextResponse.json({error:"UNAUTHENTICATED"},{status:401})}}
export async function POST(){try{await requireUser();return NextResponse.json({error:"AUTH_PROVIDER_NOT_CONFIGURED"},{status:501})}catch{return NextResponse.json({error:"UNAUTHENTICATED"},{status:401})}}
