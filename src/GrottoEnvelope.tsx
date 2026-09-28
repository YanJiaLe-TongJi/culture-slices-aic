import {useMemo} from 'react';
import {Blocks,Box,type Block} from './DioramaPrimitives';
import {BuildingReveal} from './BuildingReveal';
import type {WeiJinModelProps} from './WeiJinScenes';

export function GrottoEnvelope({wrap,selected}:Pick<WeiJinModelProps,'wrap'|'selected'>){
 const open=!!selected&&selected!=='cliff';
 const wings=useMemo(()=>{const a:Block[]=[];for(let i=-18;i<=18;i++)for(let j=-15;j<=7;j++){
  const x=i*.55,z=j*.55;if(Math.abs(x)<6.2&&z>-4.65||z>2.4+Math.sin(x*.9)*1.2)continue;const h=6.6+Math.sin(x*1.3)*.5+Math.cos(z*.9)*.65-Math.max(0,Math.abs(x)-6.2)*1.2; if(h<.7)continue;
  for(let y=.2;y<h;y+=.4){const n=Math.abs(Math.sin(x*31+z*17+y*4));if(Math.abs(x)>6.55&&y>h-(Math.sin(z*2.7+x)*.5+.5)*1.4)continue;a.push({p:[x,y,z],s:[.55,.4,.55],c:n>.55?'#ae9878':n>.2?'#b7a283':'#c1ad8e'});}
 }return a;},[]);
 const roof=useMemo(()=>{const a:Block[]=[];for(let x=-6.05;x<=6.1;x+=.48)for(let z=-4.45;z<=3.5;z+=.48){const h=.65+Math.abs(Math.sin(x*.9+z*.8))*.6;a.push({p:[x,6.08+h/2,z],s:[.48,h,.48],c:Math.sin(x*13+z*7)>0?'#bba589':'#ac9678'});}return a;},[]);
 const front=useMemo(()=>{const a:Block[]=[];for(let x=-6;x<=6;x+=.4)for(let y=.18;y<6.15;y+=.36){if(Math.abs(x)<1.2&&y<2.65||Math.abs(x)<1&&y>3.25&&y<4.7)continue;a.push({p:[x,y,3.48],s:[.4,.36,.64],c:Math.sin(x*7+y*17)>.1?'#c0aa86':'#b5a07e'});}return a;},[]);
 return <>
 {wrap('cliff',<><Blocks data={wings}/><Box p={[0,.02,-.1]} s={[11.8,.11,8.9]} c='#c6b79b'/></>)}
 {wrap('entrance',<><BuildingReveal open={open} wall><Blocks data={front}/><Box p={[1.35,1.3,3.87]} s={[.18,2.7,.14]} c='#b49c77'/><Box p={[-1.35,1.3,3.87]} s={[.18,2.7,.14]} c='#b49c77'/><Box p={[0,2.73,3.87]} s={[2.86,.18,.18]} c='#c9b28b'/></BuildingReveal><Box p={[0,.12,4.6]} s={[3.1,.24,1.55]} c='#b6a180'/><Box p={[0,.04,5.65]} s={[3.55,.08,.65]} c='#c0ad8d'/></>)}
 <BuildingReveal open={open}><Blocks data={roof}/></BuildingReveal>
 <BuildingReveal open={open} wall><Box p={[6,3.02,-.5]} s={[.65,6.04,7.65]} c='#b3a082'/></BuildingReveal>
 </>;
}
