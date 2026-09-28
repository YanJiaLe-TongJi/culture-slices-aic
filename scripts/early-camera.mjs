import {lateLayout} from '../src/late-layouts.ts';
import {middleLayout} from '../src/middle-layouts.ts';
import {earlyLayout} from '../src/early-layouts.ts';
// Browser checks project real geometry using the same documented overview frame.
export function positionEarlyCamera(camera,rect,kind){
 const layout=earlyLayout(kind)||middleLayout(kind)||lateLayout(kind),center=layout?.center||[0,.65,0],scale=layout?.scale||(kind==='bridge'?1.66:1);
 camera.position.set(center[0]+8,center[1]+9,center[2]+12);camera.lookAt(...center);
 camera.zoom=Math.min(62,rect.width/(18.5*scale),rect.height/(14.5*scale));camera.updateProjectionMatrix();camera.updateMatrixWorld();
}
