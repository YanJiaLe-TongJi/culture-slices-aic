import type {Exhibit} from './exhibits';
export interface ExhibitProgress{version:1;entered:boolean;viewed:string[];actions:string[]}
export const LAST_SCENE_KEY='culture-slice:last-scene:v1';
export const exhibitKey=(id:string)=>`culture-slice:exhibit:${id}:v1`;
export const freshExhibit=():ExhibitProgress=>({version:1,entered:false,viewed:[],actions:[]});
export function restoreExhibit(s:Exhibit,raw:string|null):ExhibitProgress{
 try{const d=JSON.parse(raw||'null');if(d?.version!==1||!Array.isArray(d.viewed)||!Array.isArray(d.actions))return freshExhibit();const actions:string[]=[];for(const step of s.steps){if(d.actions[actions.length]!==step.id)break;actions.push(step.id);}return {version:1,entered:d.entered===true,viewed:[...new Set<string>(d.viewed.filter((id:unknown)=>s.objects.some(o=>o.id===id)))],actions};}catch{return freshExhibit();}
}
export function completeStep(s:Exhibit,p:ExhibitProgress,id:string){return s.steps[p.actions.length]?.id===id?{...p,actions:[...p.actions,id]}:p;}
export function createActionClock(done:(id:string)=>void,active:(running:boolean)=>void=()=>{}){
 const c={running:false,id:'',index:0,phase:0,duration:1,start(id:string,index:number,duration:number){if(c.running)return;c.id=id;c.index=index;c.phase=0;c.duration=duration;c.running=true;active(true);},advance(dt:number){if(!c.running||!Number.isFinite(dt))return;c.phase=Math.min(1,c.phase+Math.max(0,dt)/c.duration);if(c.phase>=1)c.finish();},finish(){if(!c.running)return;const id=c.id;c.running=false;c.phase=0;active(false);done(id);},cancel(notify=true){c.running=false;c.phase=0;if(notify)active(false);}};return c;
}
export type ActionClock=ReturnType<typeof createActionClock>;
