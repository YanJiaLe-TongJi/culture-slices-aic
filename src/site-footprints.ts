export type Footprint=readonly (readonly [number,number])[];
// Display cuts follow the activity areas, not the extent of an excavated site.
export const villageFootprint:Footprint=[[-7.2,-3.4],[-5.8,-5.3],[-2.6,-5.6],[.2,-5.1],[3.1,-5.5],[6.4,-3.7],[7.2,-.8],[6.6,2.8],[4.6,4.2],[1.5,4.2],[.6,5.6],[-2.3,5.6],[-3.1,4.7],[-5.9,4.5],[-7.1,2.1],[-6.7,-.5]];
export const potteryFootprint:Footprint=[[-6.8,-4.8],[-2.7,-5.2],[-1.5,-4.4],[5.7,-4.4],[6.6,-2.9],[6.4,2.1],[5.4,3.8],[2.5,3.8],[2.5,5.35],[-1.6,5.35],[-2.25,4.4],[-5.7,4.4],[-6.4,3.1],[-6.4,1.45],[-5.7,.55],[-6.7,-.6]];
export const fluteFootprint:Footprint=[[-6.5,-3.8],[-4.7,-5.3],[-.8,-5.1],[2.6,-4.65],[6.5,-5.5],[6.5,5.45],[3.8,5],[2.3,4.25],[.3,4.8],[-3.9,4.8],[-5.65,3.3],[-6.8,.9],[-6.25,-1.3]];
export function inFootprint(x:number,z:number,outline:Footprint){let inside=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const a=outline[i],b=outline[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function edgeDistance(x:number,z:number,outline:Footprint){let result=Infinity;for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));result=Math.min(result,Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz));}return result;}
