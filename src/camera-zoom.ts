import {Vector3, type Camera} from 'three';

// Translate both ends of the view so zooming out recenters without changing rotation.
export function recenterOnZoomOut(camera:Camera&{zoom:number},target:Vector3,center:readonly number[],previousZoom:number,overviewZoom:number){
  if(camera.zoom>=previousZoom)return;
  const amount=previousZoom<=overviewZoom?1:Math.min(1,(previousZoom-camera.zoom)/(previousZoom-overviewZoom));
  const offset=new Vector3(center[0],center[1],center[2]).sub(target).multiplyScalar(amount);
  target.add(offset);
  camera.position.add(offset);
}
