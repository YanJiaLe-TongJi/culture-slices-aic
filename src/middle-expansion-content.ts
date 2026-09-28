import type {Exhibit,ExhibitObject,Point} from './exhibits';
type Space=[id:string,name:string,position:Point,fact:string,detail:string,source:string];
const spaces:Record<string,Space[]>={
 ewer:[['rear-room','后室与窄院',[-2.2,1,-5.6],'错位房屋之间留出通行与生活空间。','后室、侧房与席地前室共同组成宅地；具体组合是根据六朝砖瓦材料组织的推定，不能看作原主人宅院。','nanjing-six-dynasties-space'],['side-yard','侧院与排水方向',[5.1,.7,-1.5],'房屋与砖巷需要一起考虑雨水去向。','侧院通向屋前木衬沟；小院与排水设施为缩小的教学组合，水沟不是通航运河。','nanjing-drainage']],
 kiln:[['drying-yard','晾坯与备烧台',[-4.4,1,-6.6],'瓷坯进窑之前还需要成形与准备。','台地、木架与器坯数量是说明窑外作业的场景推定，不是禁山发掘的原位工场平面。','jinshan-kiln'],['clay-pit','泥料与用水区',[5.8,.8,1.3],'制作陶瓷需要组织泥料、坯体与燃料。','这处泥料池和旁边的筐是补充的教学情境；不据模型推断泥料配方或原窑生产参数。','jinshan-kiln']],
 grotto:[['cliff','洞窟与整片岩壁',[0,4,-2.8],'洞室开凿于石壁，不是一座独立木屋。','外部崖体轮廓和尺度经压缩；保留石窟体量，不增建后世窟前楼阁。选择入口或内部对象时才展开围护。','sinica-yungang-six'],['entrance','洞口与上方明窗',[0,2.3,3.7],'入口、明窗和内部中心柱是不同层次的空间。','参照图像资料的洞口与明窗关系简化；点选后前壁与顶盖隐去是现代讲解，不是原窟敞顶。','sinica-yungang-six']],
 tea:[['inner-court','后庭与三间后室',[0,1,-7.3],'前堂、庭院与后室沿轴线组织宅院。','借西安博物院三彩院落的二进和三间后室线索，压缩房间数量及比例；不宣称晚唐法门寺建筑原貌。','xian-tang-court'],['side-rooms','分间侧厢',[6.5,1,-4.5],'侧厢分成数段，高低与主屋不同。','分间侧厢与悬山屋面来自唐代明器线索；明器的绿釉不能解释为真实民居普遍使用绿色琉璃瓦。','xian-tang-court']],
 plough:[['upper-fields','田块与支渠',[3.1,.5,-5.7],'农具工作在田埂与水道组织的土地上。','田块高差、支渠与稻株为农业环境示意，不对应已测绘唐代水利系统，也不模拟灌溉效率。','ihns-jiangdong-plough'],['threshing','宅旁晾晒地',[-6.6,.6,3.3],'耕作之外还需要存放和整理作物的空间。','草泥农舍、柴棚、草束和晒地是环境推定，没有据此断定唐代农家统一采用这种平面。','ihns-jiangdong-plough']],
 printing:[['paper-yard','后院晾纸与存板',[0,1,-6.5],'印刷作业需要在木版、纸张和存放空间之间衔接。','后天井、晾架与存板间按教学用途组织，不声称是晚唐出土印坊的原布局。','chengdu-street-phases'],['street-front','土巷与相接铺屋',[-5,.9,3.5],'临街经营与后部作业形成不同空间。','只借成都江南馆街唐末层房址与土路线索，邻屋立面和屋架为推定，不倒用南宋铺砖大街。','chengdu-street-phases']],
 diancha:[['upper-room','楼上与沿街木廊',[-1.5,3.5,-3.5],'楼层与临街棚架让店面的体量更有层次。','楼上房间、外梯和木廊是《清明上河图》街市意象的组合推定，不对应画中某家确定商号。','dpm-qingming-song'],['street-corner','街角与后部服务房',[3.4,1,-5.9],'茶案贴近街道，备物空间收在后部。','折角街道、侧房和高桌凳用于说明生活关系；与唐代席地院内备茶形成场景对照，不能据此概括全部唐宋住宅。','dpm-qingming-song']],
 bridge:[['cargo-yard','临岸货棚',[6.4,1.2,.5],'桥头市场之外，货物还需要装卸与暂存。','货棚、堆垛与接岸关系取汴河画意组织，尺寸与货物数量为推定。','dpm-qingming-song'],['moorings','泊船与系缆',[1.6,.5,-4.1],'泊岸的船和正在过桥的船处在不同作业状态。','泊船、缆绳与木栈台为教学组合；不把动画作为真实航行或系泊指导。','dpm-qingming-song']],
 landscape:[['sandbar','江面浅洲',[7.6,.15,4.3],'低平的洲岸与大块水面一起形成疏密关系。','洲岸是基于画卷坡岸与水面意象的再组织，不是富春江某处沙洲的测绘复原。','npm-fuchun-wuyong'],['shore-path','疏林与岸边小径',[-8.7,.6,.15],'山、树与小屋之间仍留下空处。','曲岸、小径与疏林体现画境关系，不扩成高密度聚落，也不加入明清园林式楼阁。','npm-fuchun-wuyong']],
};
const buildings:Record<string,[string,Point,string]>={
 ewer:['house',[-1.2,1,.3],'低层瓦屋、后室与侧房错位排列，窄院接横向砖巷。屋顶和前侧墙默认完整，选择屋内器物后才展开。'],
 kiln:['shed',[-5.05,1,-3.15],'开敞备坯棚位于窑外较低的平台，与上部晾坯台、右侧泥料区分开。棚顶与支架完整，选中后抬起屋面观察内部。'],
 grotto:['pillar',[0,2.6,-.3],'中心塔柱连接窟顶。全景展示完整岩壁和顶盖；选择中心柱、洞口或其他内部对象后剖开围护，便于观察通道与石檐。'],
 tea:['house',[0,1,.65],'宽阔双进宅院分出前茶厅、分间侧厢和三间后室；选择器物后前厅展开。数量、尺度与陈设为教学推定。'],
 plough:['shed',[-6.65,1,-5.5],'完整草泥农舍坐落在抬高的田旁宅地，开敞工具棚另设在前方；农舍不是残缺一半的房屋，选中后才展开。'],
 printing:['shop',[0,1,-.35],'纵深铺作由临街作业间、后天井和存板间串联，邻屋沿土巷相接。选择印刷工具时展开屋顶和前侧墙。'],
 diancha:['stall',[-1.5,2,-2.7],'街角茶屋有两层体量、沿街木廊、外梯与前方敞棚，后部另设低矮服务房。点选茶器后掀开茶棚以观察。'],
};
export function expandMiddleContent(scene:Exhibit){
 const entries=spaces[scene.kind];if(!entries)return;
 for(const [id,name,position,fact,detail,source] of entries){scene.objects.push({id,name,position,fact,detail,sourceIds:[source],kind:'生活空间 · 教学演绎'} satisfies ExhibitObject);}
 const building=buildings[scene.kind];if(building){const obj=scene.objects.find(o=>o.id===building[0]);if(obj){obj.position=building[1];obj.detail=building[2]+' '+obj.detail;}}
 const explanation=scene.kind==='landscape'?'扩大山脊、疏林和留白水面，三维画境仍非地形测绘。':scene.kind==='bridge'?'扩大河段中的货棚、泊船和桥头街屋分别可观察，空间配置为画意推定。':'本轮建筑全景完整；选中内部器物或相应房屋后围护平滑展开，返回全景恢复。新增作业和生活空间均为依据已有资料组织的教学推定。';
 scene.interpretation+=' '+explanation;
 scene.qa.push({question:'这些房屋和布局是原样复原的吗？',answer:building?building[2]+' 这是依资料线索组织的教学场景，地上结构、尺寸和陈设不能当作测绘复原。':explanation,sourceIds:[...new Set(entries.map(e=>e[5]))]});
}
