export interface Env{ORIGIN_URL:string}
export default{async fetch(request:Request,env:Env){const url=new URL(request.url);const upstream=new URL(url.pathname+url.search,env.ORIGIN_URL);return fetch(new Request(upstream,request))}}
