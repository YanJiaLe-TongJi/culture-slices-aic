export type ObjectId = 'slab' | 'roller' | 'grain' | 'ding' | 'jar' | 'clay' | 'shovel' | 'sickle';
export type ZoneId = 'grinding' | 'cooking' | 'pottery' | 'dwelling' | 'field-edge';
export interface ZoneDefinition { id: ZoneId; name: string; english: string; question: string; description: string; position: [number,number,number]; sourceIds: string[] }
export type ActionId = 'placed' | 'ground';
export interface SourceEntry { id: string; institution: string; title: string; url: string; facts: string[] }
export interface ObjectDefinition { id: ObjectId; zoneId: ZoneId; name: string; english: string; kind: string; description: string; fact: string; detail: string; sourceIds: string[]; position: [number, number, number] }
export interface SceneDefinition { id: string; title: string; theme: string; culture: string; objects: ObjectDefinition[]; steps: string[]; sourceIds: string[] }
export const source: SourceEntry = {
  id: 'nmc-grinding-tools', institution: '中国国家博物馆', title: '石磨盘、石磨棒',
  url: 'https://www.chnmuseum.cn/zp/zpml/kgfjp/202008/t20200824_247226.shtml',
  facts: ['介绍对象为裴李岗文化石磨盘和石磨棒。', '两件工具配套使用，将带壳粟置于磨盘，手持磨棒两端往复搓动使粟壳脱落。', '馆藏磨盘平面呈鞋底状，底部有四个柱状矮足，表面有磨蚀形成的凹陷。', '磨棒由砂岩磨制，呈细长圆柱状。', '这类工具也可用于采集的坚果类食物脱壳。']
};
export const objects: ObjectDefinition[] = [
  { id: 'slab', zoneId: 'grinding', name: '石磨盘', english: 'GRINDING SLAB', kind: '文物线索 · 加工工具', description: '一块石头，承托着一日的食物。', fact: '留在石面上的凹陷，是反复使用留下的痕迹。', detail: '磨盘与磨棒配合使用。国博资料描述的磨盘有四个矮足，表面可见磨蚀形成的凹陷。这里的体素模型保留这些形制线索，比例与细节经过艺术化简化。', sourceIds: [source.id], position: [-1.5, 0.55, 2.7] },
  { id: 'roller', zoneId: 'grinding', name: '石磨棒', english: 'GRINDING ROD', kind: '文物线索 · 配套工具', description: '来回之间，坚硬的谷壳渐渐松开。', fact: '手持磨棒两端，在磨盘上往复搓动。', detail: '资料中的磨棒由砂岩磨制，呈细长圆柱状。它与磨盘组成一套工具。交互用简化的往复动画说明使用关系，不模拟真实力学、劳动时间或加工效率。', sourceIds: [source.id], position: [-1.5, 0.85, 2.7] },
  { id: 'grain', zoneId: 'grinding', name: '谷物', english: 'MILLET', kind: '情境对象 · 非馆藏实物', description: '从一粒带壳的粟，开始理解一套工具。', fact: '国博资料以带壳粟说明磨盘和磨棒的配合使用。', detail: '场景中的谷粒与容器是教学性示意，不对应一件已登记的馆藏文物。操作前后颜色与形态的变化仅用于表达加工过程。', sourceIds: [source.id], position: [-.1, .4, 3.2] }
];
objects.push(
  { id:'ding', zoneId:'cooking', name:'乳钉纹红陶鼎', english:'EARTHENWARE TRIPOD', kind:'文物线索 · 新郑裴李岗出土', description:'三只足，留出一簇火的位置。', fact:'陶鼎用于炊煮。三个足在器身下方留出了添加薪柴的空间。', detail:'河南博物院藏，1977 年新郑裴李岗 M5:4 出土，高 22 厘米、口径 23 厘米。红陶器身与乳钉纹依照馆方文字简化表现；乳钉的具体功能尚无定论。火塘和食物情境为艺术演绎，不是这件器物的出土原位。', sourceIds:['henan-ding'], position:[1.8,.65,2.6] },
  { id:'jar', zoneId:'dwelling', name:'红陶双耳壶', english:'TWO-HANDLED JAR', kind:'同文化参照 · 长葛石固出土', description:'小小的开口，圆润的腹部。', fact:'这件小口双耳壶高 19.5 厘米，肩部两侧有带系孔的耳。', detail:'采用文物出版社介绍的河南博物院藏标本：1980 年长葛石固出土，高领、卵形腹、素面。它与敞口陶鼎形成器形对比。没有这件壶的残留物资料，不能断言原来盛装的是水、粮食或酒。房屋内部摆放为艺术设计。', sourceIds:['wenwu-jar'], position:[0,.5,-2.5] },
  { id:'clay', zoneId:'pottery', name:'泥条与陶坯', english:'COIL BY COIL', kind:'制作过程示意 · 非馆藏原物', description:'把泥条盘起来，容器慢慢有了形状。', fact:'乳钉纹红陶鼎的内壁留有泥条盘筑的痕迹。', detail:'这里以泥条逐层叠加展示成形关系，不复刻某位制陶者的动作。旁边的低矮窑址也是示意：公开资料支持生活单元中存在陶窑，其完整结构还需要发掘图核对。', sourceIds:['henan-ding','peiligang-settlement'], position:[-4,.5,1] },
  { id:'shovel', zoneId:'field-edge', name:'石铲', english:'STONE SPADE', kind:'文物线索 · 新郑裴李岗出土', description:'从一片土地，到可以播种的地方。', fact:'国博介绍这类石铲用于垦荒、翻地。', detail:'参考 1978 年新郑裴李岗出土的国博藏品，长 30.3 厘米、宽 10 厘米。当前仅用简化裸石器表达形制，不把尚未核对的装柄方式当作事实。周围植被属于教学示意。', sourceIds:['nmc-spade'], position:[4.5,.45,1.4] },
  { id:'sickle', zoneId:'field-edge', name:'锯齿石镰', english:'SERRATED STONE SICKLE', kind:'同文化参照 · 郏县水泉出土', description:'细小的齿，也能成为收获的工具。', fact:'弧形石镰的刃部带有细齿，尾端有利于绑缚。', detail:'参考国博藏品，1989 年河南郏县水泉出土，长 20.6 厘米、宽 6 厘米。馆方将其作为裴李岗文化典型器形介绍。它并非新郑裴李岗出土，不能仅凭器形确定曾收割哪种作物。', sourceIds:['nmc-sickle'], position:[5.2,.4,2.5] }
);
export const sources: SourceEntry[] = [source,
  {id:'henan-ding',institution:'河南博物院',title:'乳钉纹红陶鼎',url:'https://www.chnmus.net/sitesources/hnsbwy/page_pc/dzjp/mzyp/rdwhtd/list1.html',facts:['1977 年新郑裴李岗出土，高 22 厘米、口径 23 厘米。','红陶炊煮器，有三足和乳钉纹；内壁留有泥条盘筑痕迹。','乳钉的具体功能尚不明确。']},
  {id:'wenwu-jar',institution:'文物出版社',title:'裴李岗文化的红陶小口双耳壶',url:'https://wenwu.wbsjk.com/newsinfo/1327877.html?templateId=508839',facts:['河南博物院藏，1980 年长葛石固出土。','高 19.5 厘米、口径 5.4 厘米；高领、卵形腹、双耳有系孔、素面。','此处资料不能确定这件壶的原始内容物。']},
  {id:'nmc-spade',institution:'中国国家博物馆',title:'石铲',url:'https://www.chnmuseum.cn/zp/zpml/kgfjp/202111/t20211126_252445.shtml',facts:['裴李岗文化，1978 年河南新郑裴李岗出土。','长 30.3 厘米、宽 10 厘米，用于垦荒、翻地。']},
  {id:'nmc-sickle',institution:'中国国家博物馆',title:'石镰',url:'https://www.chnmuseum.cn/zp/zpml/kgfjp/202107/t20210719_250697.shtml',facts:['1989 年河南郏县水泉出土，长 20.6 厘米、宽 6 厘米。','锯齿石镰是裴李岗文化典型器形，弧形石片带细齿刃，尾部有绑缚线索。']},
  {id:'peiligang-settlement',institution:'河南省文物考古研究院',title:'裴李岗遗址新发现与新研究 · 2026 讲坛实录',url:'https://www.hnswwkgyjy.cn/NewsView.php?News_ID=2920',facts:['生活区存在多组包含房址、灰坑、陶窑的生产生活单元，并发现木骨泥墙建筑线索。','植物遗存包括黍、稻、粟与野生果实。','本场景的房屋数量、屋顶、路径、器物摆放为艺术组合，非遗址平面复原。']}
];
export const zones: ZoneDefinition[] = [
  {id:'grinding',name:'屋前磨粮',english:'THE GRINDING CORNER',question:'两块石头，怎样配合工作？',description:'把谷物放上磨盘，在来回之间发现工具的关系。',position:[-1.2,0,2.7],sourceIds:[source.id]},
  {id:'cooking',name:'灶边炊煮',english:'AROUND THE FIRE',question:'陶鼎的三只足，为什么留出空隙？',description:'从低处观察火与容器，看看食物加工后的另一种可能。',position:[1.8,0,2.6],sourceIds:['henan-ding']},
  {id:'pottery',name:'制陶角',english:'SHAPING THE EARTH',question:'一团泥，怎样变成容器？',description:'泥条逐层盘起，陶器的形状在手艺中出现。',position:[-4,0,.5],sourceIds:['henan-ding','peiligang-settlement']},
  {id:'dwelling',name:'屋内器用',english:'A PLACE TO LIVE',question:'不同的器形，对应怎样的生活需要？',description:'屋顶展开，走近木骨泥墙内的一隅。房屋结构与摆放为示意。',position:[0,.2,-2.5],sourceIds:['wenwu-jar','peiligang-settlement']},
  {id:'field-edge',name:'村边土地',english:'AT THE FIELD EDGE',question:'翻地与收获，需要相同的工具吗？',description:'比较石铲与石镰，循着食物的线索回到磨粮处。',position:[4.6,0,2],sourceIds:['nmc-spade','nmc-sickle']}
];
export const scene: SceneDefinition = { id: 'peiligang-grain', title: '一粟之间 · 裴李岗生活村落', theme: '食物怎样经过土地、工具、火和容器，进入史前生活？', culture: '新石器时代 · 裴李岗文化线索', objects, steps: ['观察器物', '放入谷物', '尝试加工', '回顾发现'], sourceIds: sources.map(s=>s.id) };
export const questions = ['这两件工具怎样配合？', '为什么石面有凹陷？', '还能加工哪些食物？'];
export function presetAnswer(question: string, objectId: ObjectId | null): string {
  const obj=objects.find(o=>o.id===objectId);
  if (obj && (obj.zoneId!=='grinding' && questionsFor(objectId).includes(question) || /^这是什么[？?]?$/.test(question))) return `依据${sources.find(s=>s.id===obj.sourceIds[0])?.institution}的公开资料：${obj.fact} ${obj.detail}`;
  if (obj&&obj.zoneId!=='grinding') return '自由问答尚未连接。你仍可选择当前器物的预置问题，或在“资料”中查看介绍与原始来源。';
  if (/哪些食物|坚果/.test(question)) return '依据中国国家博物馆的介绍，这类磨盘和磨棒除了加工谷物，也可以用于采集的坚果类食物脱壳。具体某一次使用处理了什么，不能仅由这段资料推断。';
  if (/凹陷|痕迹/.test(question)) return '国博资料指出，磨盘表面有磨蚀形成的明显凹陷。反复加工会在工具表面留下使用痕迹。场景模型把这一线索做了简化，不能用于测量原物。';
  if (/配合|怎么用|怎样|为什么这样/.test(question)) return '依据国博资料，先把带壳粟放在磨盘上，再手持磨棒两端来回搓动，使谷壳脱落。你看到的动画只演示两件工具的配合关系，不代表真实加工所需的时间。';
  if (/这是什么|这个/.test(question) && !objectId) return '先在场景中选中一个物品，我就能围绕它为你讲解。你想了解石磨盘、石磨棒，还是谷物？';
  return '自由问答尚未连接。你仍可选择上方的预置问题，或在“资料”中查看已核对的介绍与原始来源。';
}

export function questionsFor(id:ObjectId|null,zoneId?:ZoneId|null):string[]{
  if(!id&&zoneId&&zoneId!=='grinding')id=objects.find(o=>o.zoneId===zoneId)?.id||null;
  if(!id || objects.find(o=>o.id===id)?.zoneId==='grinding')return questions;
  return id==='ding'?['陶鼎为什么有三只足？','乳钉有什么作用？']:id==='jar'?['这件壶有什么特点？','这件壶原来装什么？']:id==='clay'?['陶器怎样成形？','这里的陶窑是精确复原吗？']:id==='shovel'?['石铲有什么用途？','这件石铲在哪里出土？']:['石镰为什么有细齿？','这件石镰在哪里出土？'];
}
export function contextSources(objectId:ObjectId|null,zoneId?:ZoneId|null):SourceEntry[]{
  const obj=objects.find(o=>o.id===objectId),zone=zones.find(z=>z.id===(obj?.zoneId||zoneId));
  const ids=obj?.sourceIds||zone?.sourceIds||sources.map(s=>s.id);
  return sources.filter(s=>ids.includes(s.id));
}
export function presetResult(question:string,objectId:ObjectId|null,zoneId?:ZoneId|null){
  const contextual=objects.find(o=>o.zoneId===zoneId);
  if(!objectId&&contextual&&questionsFor(contextual.id).includes(question))objectId=contextual.id;
  const answer=presetAnswer(question,objectId);
  return {answer,sourceIds:/依据|国博资料/.test(answer)?contextSources(objectId||'slab').map(s=>s.id):[],mode:'preset' as const};
}
