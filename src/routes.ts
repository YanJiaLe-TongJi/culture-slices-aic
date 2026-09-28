import {eras,scenes} from './catalog';
export type Route={kind:'era';id:string}|{kind:'scene';id:string}|{kind:'not-found'};
export function parseRoute(hash:string):Route{
  if(!hash||hash==='#'||hash==='#/')return {kind:'era',id:eras[0].id};
  const match=/^#\/(era|scene)\/([a-z0-9-]+)$/.exec(hash);
  if(!match)return {kind:'not-found'};
  if(match[1]==='era'&&eras.some(e=>e.id===match[2]))return {kind:'era',id:match[2]};
  if(match[1]==='scene'&&scenes.some(s=>s.id===match[2]&&s.status==='ready'))return {kind:'scene',id:match[2]};
  return {kind:'not-found'};
}
