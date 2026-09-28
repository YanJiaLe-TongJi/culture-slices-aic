/** Split a ground cell around an actual opening, without overhanging edge cells. */
export type Rect={x0:number;x1:number;z0:number;z1:number};
export function subtractOpening(cell:Rect,hole:Rect):Rect[]{
 const x0=Math.max(cell.x0,hole.x0),x1=Math.min(cell.x1,hole.x1),z0=Math.max(cell.z0,hole.z0),z1=Math.min(cell.z1,hole.z1);
 if(x0>=x1||z0>=z1)return [cell];
 return [{...cell,x1:x0},{...cell,x0:x1},{x0,x1,z0:cell.z0,z1:z0},{x0,x1,z0:z1,z1:cell.z1}].filter(r=>r.x1-r.x0>1e-6&&r.z1-r.z0>1e-6);
}
