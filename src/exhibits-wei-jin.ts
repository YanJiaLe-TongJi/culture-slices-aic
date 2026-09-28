import type {Exhibit} from './exhibits';
import type {SourceEntry} from './content';
const ewer:SourceEntry={id:'wenzhou-jin-ewer',institution:'温州博物馆',title:'青釉点彩盘口鸡首壶',url:'https://wzmuseum.cn/Art/Art_28/Art_28_3272.aspx',facts:['馆方将此器定为东晋永和七年（351）。','器身圆腹、盘口，鸡头作为流，背部有拱形把，肩侧有桥形耳。','青黄釉上点褐彩，外壁施釉没有一直到底。']};
const city:SourceEntry={id:'nanjing-six-dynasties-space',institution:'六朝博物馆 · 人民画报现场报道',title:'六朝博物馆：赓续文脉，一眼千年',url:'https://www.rmhb.com.cn/yxsj/tpgs/202506/t20250624_800405891.html',facts:['六朝建康材料包括城墙、排水遗迹及砖瓦。','出土瓦当有面纹、兽面和莲花等装饰；不能把高等级建筑构件视为所有民居的配置。','本场景的瓦屋、案席和门窗是组合推定，不是出土建筑的原貌。']};
const water:SourceEntry={id:'nanjing-drainage',institution:'博物南京',title:'六朝消夏录',url:'https://www.xhby.net/content/s687f5262e4b05c8d159ccc5d.html',facts:['六朝博物馆展示的南朝排水设施用砖砌两壁，底部有阶梯状木板。','排水关系用于说明江南城市生活环境，模型中的小沟与瓦屋不对应某处真实宅院。']};
const kiln:SourceEntry={id:'jinshan-kiln',institution:'浙江省文物考古研究所 · 现场采访',title:'探秘尘封千年的禁山窑址',url:'https://cpc.people.com.cn/n/2014/1224/c83083-26266077.html',facts:['上虞禁山发现东汉、三国、西晋不同时期的龙窑及装烧器具。','发掘揭示窑体部分深入地面的结构，窑炉与坡地结合。','支烧和间隔用的窑具帮助安排器物，模型只示意支承关系。']};
const kilnStructure:SourceEntry={id:'jinshan-structure',institution:'浙江省文物考古研究所 · 郑建明访谈',title:'见证青瓷发展史：上虞禁山窑址',url:'https://zjnews.zjol.com.cn/system/2015/04/10/020597296.shtml',facts:['窑炉可分火膛、斜坡窑床和排烟室。','不同阶段的窑炉在长度、坡度及窑具上有差别。','动画没有模拟温度、气氛或真实烧成时间，釉色变化不能作为烧窑配方。']};
const glaze:SourceEntry={id:'dpm-celadon-colour',institution:'故宫博物院',title:'青釉鸡头壶 · 青釉说明',url:'https://www.dpm.org.cn/collection/ceramic/227477.html',facts:['青釉的颜色可以泛黄或泛绿，不是一种固定蓝色。','含铁釉料与烧成条件共同影响呈色，不能只用模型颜色判断配方。','部分西晋鸡头壶的鸡首是实心装饰；应逐件核对是否能作流。']};
const cave:SourceEntry={id:'sinica-yungang-six',institution:'中央研究院 · 佛教石窟图像资料',title:'云冈石窟第六窟',url:'https://buddhism.ascdc.sinica.edu.tw/buddhism/layer1.php?id1=G02060000',facts:['第六窟属于北魏，中心为方形塔柱，柱周与窟壁之间留有通道。','中心柱南面下层为结跏趺坐佛，其他面有不同造像组合。','柱与窟壁上的连续故事浮雕，是观察石窟叙事的线索。']};
const caveDetail:SourceEntry={id:'yungang-stone-eaves',institution:'云冈石窟艺术展 · 浙江农林大学图书馆',title:'第6窟中心塔柱东南角',url:'https://lib.zafu.edu.cn/info/1148/4235.htm',facts:['第六窟塔柱上下两层，顶部连接窟顶。','下层顶缘有石刻仿木屋檐、瓦垄和椽头等细节。','本模型压缩雕像数量与尺度，切去顶盖和前壁帮助观察，不表示洞窟原本露天。']};

export const weiJinExhibits:Exhibit[]=[
 {id:'wei-jin-living',eraId:'wei-jin',kind:'ewer',title:'青瓷入席',subtitle:'江南鸡首壶小院',culture:'东晋江南 · 瓯窑器物与六朝建筑线索',question:'壶上的一只鸡，怎样成为出水的口？',description:'走入瓦屋与砖巷之间，端起鸡首壶，观察流、把和点彩怎样围绕日常使用。',accent:'#788565',ground:'#b6ba9e',interpretation:'主器参考温州博物馆东晋鸡首壶照片；建筑借鉴建康砖瓦和排水资料。两地材料只作教学组合，不声称同址出土或真实宴席。屋面、门窗、杯席与液体为自行制作的艺术演绎；倾注演示只解释有孔鸡首流的功能，不确定壶内原盛何物。',sources:[ewer,city,water,glaze],objects:[
  {id:'ewer',name:'点彩鸡首壶',kind:'馆藏形制线索',fact:'盘口、鸡首流、拱形把与桥形耳组成这件壶。',detail:'参考温州博物馆东晋青釉点彩盘口鸡首壶。模型保留圆腹、青黄釉和褐彩分区，花团为简化示意，非扫描复原。',position:[-.8,1.15,1.25],sourceIds:[ewer.id]},
  {id:'spout',name:'鸡首流与壶把',kind:'结构示意',fact:'此件馆藏的鸡首可作为流，壶把位于另一侧。',detail:'早期同类器有实心鸡首，不能由名称推断都能倒水。这里的液体是现代功能示意，没有推断原器内盛酒还是水。',position:[-1.12,1.3,1.3],sourceIds:[ewer.id,glaze.id]},
  {id:'cup',name:'承接的瓷杯',kind:'情境对象',fact:'倾注时，注意壶嘴、杯口与持握方向。',detail:'杯、低案和席是为了演示注水关系设置的器类与陈设，不对应这件壶的同出土组合。',position:[-2.0,.86,1.25],sourceIds:[ewer.id]},
  {id:'house',name:'砖台瓦屋',kind:'建筑线索与推定',fact:'砖瓦、木柱与席地空间组织了江南宅院的一角。',detail:'六朝遗址提供砖瓦等材料线索，模型屋顶、木构、直棂门窗与房间大小为推定，不用现代白墙马头墙代表六朝。',position:[.2,1.65,-2.65],sourceIds:[city.id]},
  {id:'drain',name:'砖巷与木衬沟',kind:'城市生活线索',fact:'雨水的去向也参与组织生活空间。',detail:'参照南朝排水设施的砖壁与木衬底关系缩小示意；不将公共大型排水设施原样放进家用院落。',position:[2.1,.1,3.8],sourceIds:[water.id]}
 ],steps:[
  {id:'lift',label:'提壶，观察持握位置',objectId:'ewer',duration:2.8,explanation:'已观察壶把、鸡首流与重心的关系；浮动运动用于说明，场景省略操作者。'},
  {id:'pour',label:'倾注，观察水从哪里流出',objectId:'spout',duration:4,explanation:'液体经有孔鸡首流进入杯中。不是所有时期的鸡首壶都具有这项功能。'},
  {id:'turn',label:'放回低案，转看点彩',objectId:'ewer',duration:3.2,explanation:'已观察器形、点彩与用途三个层面；这件馆藏壶的年代依据与场景推定分开列在资料卡。'}
 ],qa:[
  {question:'所有鸡首壶都能倒水吗？',answer:'不能。部分西晋鸡首壶的鸡头只是实心装饰。这里采用温州博物馆明确记载鸡首为流的东晋器物，所以可以演示倾注。',sourceIds:[ewer.id,glaze.id]},
  {question:'为什么青瓷看起来偏黄？',answer:'青釉可能偏黄、偏绿，并非固定的蓝绿色。釉料和烧成条件都会影响呈色；屏幕颜色也不能代替对实物的检测。',sourceIds:[glaze.id]},
  {question:'这里就是原来的主人家吗？',answer:'不是。器物取瓯窑线索，瓦屋与排水另参考建康材料，这个小院是教学组合。',sourceIds:[city.id,water.id]}
 ]},
 {id:'wei-jin-making',eraId:'wei-jin',kind:'kiln',title:'坡上的窑火',subtitle:'越窑装烧工场',culture:'三国至西晋 · 浙江上虞越窑线索',question:'一件青瓷入窑时，为什么还需要别的器具？',description:'沿坡走近半地穴式龙窑，把坯体与窑具组合，再追踪从火膛到窑尾的路径。',accent:'#92734d',ground:'#b6a27f',interpretation:'根据禁山窑址的斜坡窑、半地穴结构和窑具线索组合制作。并非某条窑炉的测绘复原；窑长、拱顶、棚架、窑具尺度与装窑动作均简化。剖开顶盖、流线与釉色渐变是现代讲解层，不能作为真实燃烧、还原气氛或温度控制指导；烧成与冷却时间被压缩。',sources:[kiln,kilnStructure,glaze],objects:[
  {id:'kiln',name:'斜坡龙窑',kind:'遗址结构线索',fact:'火膛、窑床与排烟部分沿坡连成一个整体。',detail:'借鉴上虞禁山三国至西晋窑炉线索；模型前低后高且部分深入坡地，观察时剖开一侧拱顶。',position:[1.2,1.5,-.6],sourceIds:[kiln.id,kilnStructure.id]},
  {id:'supports',name:'支烧具与间隔具',kind:'装烧器具示意',fact:'烧成器物之外，还有支承和分隔用的窑具。',detail:'以支烧、间隔关系帮助理解装窑，不把器物直接相互粘连。此模型不是某一件出土窑具的尺寸复刻。',position:[-1.8,.55,2.1],sourceIds:[kiln.id]},
  {id:'blank',name:'入窑的瓷坯',kind:'器类示意',fact:'成形只是制瓷过程的一部分，烧成会改变材料。',detail:'以简化小碗表现坯与釉的状态变化，不对应指定馆藏成品，也不通过动画宣称复原烧制配方。',position:[-2.9,.88,1.3],sourceIds:[kilnStructure.id,glaze.id]},
  {id:'firebox',name:'窑头火膛',kind:'结构线索',fact:'热与烟沿相连的窑体流动，不能只看窑口一处。',detail:'橙色流线是火路讲解；亮度不代表温度或烧成效率。此处不加入现代烟囱、测温仪或宋代整套匣钵。',position:[1.25,.5,3.3],sourceIds:[kilnStructure.id]},
  {id:'shed',name:'坡下备料棚',kind:'作业空间推定',fact:'窑外也需要存放坯体、窑具和燃料的空间。',detail:'小型土木棚、木架和备料台为教学布局，不将今天遗址保护棚当作古代工棚。',position:[-4,1,-2.1],sourceIds:[kiln.id]}
 ],steps:[
  {id:'support',label:'摆放窑具，留出间隔',objectId:'supports',duration:3,explanation:'已看到支烧具与间隔具的组合；模型只演示支承，不给出真实装烧密度。'},
  {id:'load',label:'送坯入窑，观察坡度',objectId:'kiln',duration:3.8,explanation:'坯体进入沿坡上升的窑床。模型剖去部分拱顶，便于看清内部关系。'},
  {id:'fire',label:'追踪窑火，再看冷却后的釉色',objectId:'kiln',duration:5.4,explanation:'已观察火膛、窑床与窑尾的联系。烧成与冷却被压缩，颜色变化是教学示意。'}
 ],qa:[
  {question:'为什么瓷坯下面还要放东西？',answer:'装烧时还需要支承和间隔用的窑具。禁山窑址出土的窑具说明，安排坯体本身也是制瓷技术的一部分。',sourceIds:[kiln.id]},
  {question:'几秒钟就烧好了吗？',answer:'不是。动画把装窑、烧成与冷却压缩展示，光色不表示实际温度，也不能据此得到真实烧制配方。',sourceIds:[kilnStructure.id]},
  {question:'为什么窑建在坡上？',answer:'这里依据的是沿坡延伸的龙窑，火膛、窑床和排烟部分相连。不同阶段窑炉的长度、坡度有差别，本场景没有模拟气流效率。',sourceIds:[kilnStructure.id]}
 ]},
 {id:'wei-jin-culture',eraId:'wei-jin',kind:'grotto',title:'石壁里的楼阁',subtitle:'云冈塔柱与石刻',culture:'北魏 · 云冈第6窟线索',question:'石头雕成的屋檐，为什么会出现在洞窟里？',description:'进入洞室剖面，绕着中心塔柱观察佛龛、衣褶与仿木石檐，读懂空间与雕刻的关系。',accent:'#9b8665',ground:'#c5b699',interpretation:'以云冈第6窟的方形塔柱、通道和石刻仿木细节为依据，采用压缩尺度的风格化剖面。前壁、顶盖和部分侧壁为观察而切去，塔柱原本连接窟顶。造像、数量与故事浮雕均为简化，非扫描或完整图像复原；观察光与路线是现代讲解标记，不代表历史仪式，不添加清代窟前楼阁或确定的原始彩绘。',sources:[cave,caveDetail],objects:[
  {id:'pillar',name:'两层中心塔柱',kind:'石窟空间线索',fact:'方形塔柱与周围的通道共同组织洞室。',detail:'第6窟中心塔柱上下分层并连接顶盖。模型只保留上方连接的一段石梁，前壁与顶盖的剖切不表示古代是露天空间。',position:[0,2.6,-.3],sourceIds:[cave.id,caveDetail.id]},
  {id:'buddha',name:'南面坐佛龛',kind:'造像简化',fact:'中心柱各面的造像组合并不相同。',detail:'这里参考南面下层结跏趺坐佛的姿态，保留宽衣、衣褶、背光与龛缘；造型是自行制作的简化，不代表原像的全部图像细节。',position:[0,1.7,1.0],sourceIds:[cave.id]},
  {id:'eaves',name:'仿木石檐',kind:'建筑雕刻线索',fact:'瓦垄、椽头等木建筑形象被雕进石头。',detail:'这些细部属于石刻仿木构件。它们提供建筑表达的线索，但不能只据局部装饰就复原一座北魏木殿。',position:[.1,3.35,.9],sourceIds:[caveDetail.id]},
  {id:'relief',name:'壁上叙事',kind:'叙事排列示意',fact:'连续的故事浮雕把观看连接起来。',detail:'小龛和人物这里只示意连续画面的排列，不冒充原窟完整佛传图。具体故事需回到图像资料逐一核对。',position:[-3.5,1.95,-3.85],sourceIds:[cave.id]},
  {id:'passage',name:'绕柱通道',kind:'空间关系',fact:'中心柱与窟壁之间留出了绕行空间。',detail:'发光路线是现代讲解层，用来观察围绕塔柱的通道；不复原历史礼拜次序，也不让用户操作原文物。',position:[2.6,.2,1.6],sourceIds:[cave.id]}
 ],steps:[
  {id:'section',label:'展开剖面，找到中心柱',objectId:'pillar',duration:3.2,explanation:'已分清中心柱、窟壁和顶盖的关系；剖切是现代展示方式。'},
  {id:'route',label:'沿通道，观察四面关系',objectId:'passage',duration:4,explanation:'路线围绕中心柱经过通道，用来理解空间，不规定历史礼仪的方向或次序。'},
  {id:'light',label:'移动观察光，辨认石刻屋檐',objectId:'eaves',duration:4,explanation:'光线帮助显出瓦垄与椽头。看似木建筑的局部在这里由石头雕成。'}
 ],qa:[
  {question:'柱子只是用来支撑的吗？',answer:'它同时是观看造像的中心。方形塔柱四面有不同佛龛，柱周通道把这些观看位置联系起来。',sourceIds:[cave.id]},
  {question:'屋檐是木头搭的吗？',answer:'这里观察的是石刻仿木屋檐。瓦垄与椽头把木建筑形象转入石窟雕刻，模型没有把它们当作实际木构。',sourceIds:[caveDetail.id]},
  {question:'原来的洞窟没有顶吗？',answer:'有顶，中心塔柱连接窟顶。模型为方便观察剖开前壁与顶盖，不表示原窟露天，也没有加入后世窟前楼阁。',sourceIds:[caveDetail.id]}
 ]}
];
