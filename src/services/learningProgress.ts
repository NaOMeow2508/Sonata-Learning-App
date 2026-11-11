export type Route = 'home' | 'map' | 'story' | 'mother' | 'lesson' | 'tasks';
export type Progress = {version:1;language:'zh'|'de';mode:'child'|'mother';child:{index:number;completed:boolean;paused:boolean};adult:{step:number;completed:boolean;paused:boolean};tasks:boolean[]};
export const initialProgress = (): Progress => ({version:1,language:'zh',mode:'child',child:{index:0,completed:false,paused:false},adult:{step:0,completed:false,paused:false},tasks:[false,false,false]});
export const storageKey = 'kleine-welten-v1';
export function parseProgress(raw:string|null):Progress {
 const fallback=initialProgress();
 try {
  const p=JSON.parse(raw || 'null');if(p?.version!==1)return fallback;
  const bounded=(n:unknown,max:number)=>Number.isInteger(n)&&typeof n==='number'&&n>=0&&n<=max?n:0;
  const index=bounded(p.child?.index,3),step=bounded(p.adult?.step,4);
  return {version:1,language:p.language==='de'?'de':'zh',mode:p.mode==='mother'?'mother':'child',child:{index,completed:index===3,paused:p.child?.paused===true&&index<3},adult:{step,completed:step===4,paused:p.adult?.paused===true&&step<4},tasks:Array.from({length:3},(_,i)=>p.tasks?.[i]===true)};
 } catch{return fallback;}
}
export function loadProgress():Progress {try{return parseProgress(localStorage.getItem(storageKey));}catch{return initialProgress();}}
export function saveProgress(p:Progress):boolean {try{localStorage.setItem(storageKey,JSON.stringify(p));return true;}catch{return false;}}
export function sortItem(p:Progress,choice:string,correct:string):Progress {
 if(p.child.paused||p.child.completed||choice!==correct)return p;
 const index=Math.min(3,p.child.index+1);return {...p,child:{index,paused:false,completed:index===3}};
}
export function advanceAdult(p:Progress):Progress {
 if(p.adult.paused||p.adult.completed)return p;
 const step=Math.min(4,p.adult.step+1);return {...p,adult:{step,paused:false,completed:step===4}};
}
export function getRoute(hash:string):Route {const value=hash.replace(/^#\/?/,'');return ['home','map','story','mother','lesson','tasks'].includes(value)?value as Route:'home';}
