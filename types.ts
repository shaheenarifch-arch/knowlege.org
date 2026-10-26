export type AbdulMode="learn"|"research"|"reflect"|"study"|"serve";
export type SourceKind="quran"|"translation"|"tafsir"|"hadith"|"scholarly_opinion"|"editorial";
export interface AbdulCitation{sourceId:string;kind:SourceKind;title:string;reference:string;url?:string;quote?:string;}
export interface AbdulTurn{role:"user"|"assistant";content:string;createdAt:string;citations?:AbdulCitation[];}
export interface AbdulRequest{sessionId:string;message:string;mode:AbdulMode;language?:string;voice?:boolean;}
export interface AbdulResponse{answer:string;citations:AbdulCitation[];limitations:string[];requiresScholarReferral:boolean;suggestedPrompts:string[];}
