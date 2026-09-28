import type {Exhibit,ExhibitObject,Point} from './exhibits';
type Space=[string,string,Point,string,string,string];
const spaces:Record<string,Space[]>={
 study:[['study-room','两间茅舍书斋',[-1,1.4,-.55],'茅舍、书案和藏书在原画中共同组成赏玩空间。','完整茅顶覆盖两间斋室，选中后展开屋面与前侧墙。室内尺度、隔断和家具摆放为图意推定，圈椅不是华夏原物。','nmc-zhenshang-study'],['bamboo-path','竹石间的步径',[5.5,.7,-2.5],'竹、石、树木与斋室之间保留疏朗空处。','借《真赏斋图》的竹石意象扩展庭地；曲折步石、矮墙和树木位置为设计，不是明代园林的测绘平面。','nmc-zhenshang-study']],
 porcelain:[['clay-room','泥料准备间',[-5.65,1.0,-5.3],'传统坯房将泥料准备与画坯、储放联系起来。','侧后泥房与前正间、侧廒间围出纵长天井；这是传统空间关系的教学组合，不把晚清民国资料倒称为乾隆御窑原址。','dpm-jingdezhen-layout'],['drying-court','天井与晾坯板',[-.35,.8,-5.25],'干燥、存放与搬运需要通风且可通行的空间。','晾板、器坯数量与布置为示意；坯房不是窑炉，动画末步仍是另经烧造和冷却后的对照。','ich-jingdezhen-workshop']],
 newyear:[['block-store','侧院存版间',[-6.35,1,-5.35],'印刷使用的木版需要整理和存放。','在侧间用分层架组织教学木版，与前部印绘间分开；具体存版设施和数量没有原店测绘依据。','ich-yangliuqing-print'],['gate-lane','偏门与入坊小巷',[6.6,1,3.2],'门道把街巷、作坊和院内通行联系起来。','砖墙、灰瓦、木门借清末天津建筑语言组合；偏门和影壁位置为推定，不宣称复原石家大院，也不把富商宅第等同普通画坊。','tj-shi-courtyard']],
 sewing:[['shared-kitchen','共用厨房',[5.4,1.2,-6.6],'早期两万户住宅存在多户共用厨卫的安排。','共用厨房与两层居室在本场景分设，灶台、数量和分间为教学设计；资料说明五户共用厨卫，但此微缩模型未逐户还原。','yangpu-workers-home'],['lane','住宅之间的生活巷道',[1,.8,4.3],'居住空间也包含通行、洗晒和邻里活动。','平行住宅、巷道与洗晒区参照低层街坊关系重新组织；现状改造照片不等于1970年代原貌，路面、树木和陈设为推定。','yangpu-workers-home']],
 carding:[['cotton-store','棉卷与备料仓',[-8.25,1.0,-3.3],'梳棉前的备料与厂内作业需要空间衔接。','侧仓的棉包、棉卷和货架是工业情境示意，不能把棉包看作未经前道加工就直接喂入机器，也没有还原原厂产能。','nmc-dasheng-card'],['loading-yard','侧向装卸场',[8.2,.9,.8],'仓储、装卸与车间通道服务连续作业。','装卸台和推车按教学用途布置，不是大生纱厂原位测绘；现存北车间有1985年迁建历史，与1895年馆藏机器分别看待。','nantong-sawtooth-mill']],
 cinema:[['activity-wing','侧面活动楼',[-8.85,2.6,-5.65],'文化活动建筑与院前场地共同组织公众聚集。','参考文化宫照片的平顶、玻璃开窗与走廊体量，侧楼、楼梯与尺寸重新设计。原文化宫2007年已拆，不宣称2009年设备在此使用。','huaian-workers-cinema'],['entrance','树荫入口与告示栏',[7.2,1,5.8],'到达路径、座位和放映设备共同影响观看。','入口值守间、空白告示栏与树荫步道为教学情境；不编造历史宣传内容，也不把临时银幕当作原电影院固定银幕。','huaian-workers-cinema']],
};
const buildings:Record<string,[string,Point,string]>={
 porcelain:['yard',[-.5,1.3,1],'前部画坯正间、纵向侧廒间与后天井形成紧凑生产空间。选择工具或房屋后才展开围护，烧成仍在另一个窑房发生。'],
 newyear:['courtyard',[-.3,1.3,.25],'横向印版间与纵向画门子侧房形成折角，侧存版间、后院与偏置门道各司其用；硬山砖端墙、木格扇与抬梁层次表达地域建筑线索，尺度为推定。'],
 sewing:['room',[-1.2,2.1,-.3],'两层住宅默认显示完整墙体、上层楼板与双坡屋面；点选缝纫机后展开前侧围护和前段上层楼板。后排住宅与共用厨房通过巷道联系。'],
 carding:['factory',[0,2,-2.1],'连跨锯齿屋面、高窗、砖墙与木桁架组成完整厂房，选择设备后才展开。侧备料仓和装卸场另设；现存北车间涉及1985年迁建，不能当作1895年完整原貌。'],
 cinema:['square',[-.7,2.6,-7.15],'后部文化建筑具有完整纵深、平顶女儿墙、玻璃立面与外台阶，左侧另设活动楼；放映设备在院前临时布置，布局为跨资料组合。'],
};
export function expandLateContent(scene:Exhibit){const items=spaces[scene.kind];if(!items)return;
 for(const [id,name,position,fact,detail,source] of items)scene.objects.push({id,name,position,fact,detail,sourceIds:[source],kind:'生活空间 · 教学演绎'} satisfies ExhibitObject);
 const b=buildings[scene.kind];if(b){const o=scene.objects.find(o=>o.id===b[0]);if(o){o.position=b[1];o.detail=b[2];}}
 scene.interpretation=scene.interpretation.replace('前屋面与右侧前墙展示性剖切','房屋全景保持完整，点选后前屋面与右侧墙展示性展开');
 scene.interpretation+=' 扩大的建筑、通路与功能分区依据资料线索组织，尺寸和陈设为教学推定。建筑默认完整，选择内部对象后围护平滑展开，返回全景恢复。';
 scene.qa.push({question:'这些房屋和布局是原样复原的吗？',answer:(b?.[2]||items[0][4])+' 这是不同资料线索组织的教学场景，不是同址同时的测绘复原。',sourceIds:[...new Set(items.map(i=>i[5]))]});
}
