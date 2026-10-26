import {cookies} from "next/headers";
export interface CurrentUser{id:string;email:string;roles:string[]}
export async function requireUser():Promise<CurrentUser>{
  const token=(await cookies()).get("knowlege_session")?.value;
  if(!token) throw new Error("UNAUTHENTICATED");
  // Phase 5 adapter boundary: replace with Auth.js, Clerk, or Supabase Auth validation.
  throw new Error("AUTH_PROVIDER_NOT_CONFIGURED");
}
