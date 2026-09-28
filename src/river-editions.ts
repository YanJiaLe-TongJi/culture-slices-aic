export type RiverEdition='expanded'|'detailed';
export const riverEditions={
  expanded:{label:'A · 扩大版',description:'更长河段 · 双岸街市 · 泊船与装卸',context:'扩大版：延长河段、增加街铺、泊船与装卸空间；布局为画卷线索的艺术组合。'},
  detailed:{label:'B · 精细版',description:'紧凑河市 · 瓦作木构 · 船体细节',context:'精细版：保留紧凑范围，细化筒瓦、檐椽、木拱搭接、船体板缝与篷架；节点不是测绘复原。'},
} as const;
export function parseRiverEdition(value:unknown):RiverEdition{return value==='detailed'?'detailed':'expanded';}
