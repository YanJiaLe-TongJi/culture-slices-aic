import {objects,zones,type ObjectId,type ZoneId} from './content';
export type InteractionId=ObjectId|ZoneId;
export function resolveTarget(id:InteractionId,zone:ZoneId|null):InteractionId{
  const object=objects.find(o=>o.id===id);
  return object?(object.zoneId===zone?object.id:object.zoneId):id;
}
export function targetDefinition(id:InteractionId){return objects.find(o=>o.id===id)||zones.find(z=>z.id===id)!;}
