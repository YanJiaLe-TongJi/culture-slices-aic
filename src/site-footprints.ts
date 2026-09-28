import {earlyLayouts} from './early-layouts';
export type Footprint=readonly (readonly [number,number])[];
// Display cuts follow the activity areas, not the extent of an excavated site.
export const villageFootprint:Footprint=earlyLayouts.village.outline;
export const potteryFootprint:Footprint=earlyLayouts.pottery.outline;
export const fluteFootprint:Footprint=earlyLayouts.flute.outline;
export function inFootprint(x:number,z:number,outline:Footprint){let inside=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const a=outline[i],b=outline[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function edgeDistance(x:number,z:number,outline:Footprint){let result=Infinity;for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));result=Math.min(result,Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz));}return result;}
