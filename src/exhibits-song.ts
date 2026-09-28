import type {Exhibit} from './exhibits';
import type {SourceEntry} from './content';

const bowl:SourceEntry={id:'nmc-song-jian-bowl',institution:'中国国家博物馆',title:'建窑黑釉兔毫纹盏',url:'https://www.chnmuseum.cn/zp/zpml/csp/202203/t20220309_254231.shtml',facts:['建窑黑釉盏的细密条状结晶呈兔毫般的纹理，并非用笔画上兔毛。','深色釉面可衬托浅色茶沫，露胎足部与积釉也是观察器物的线索。']};
const pitcher:SourceEntry={id:'nmc-song-long-spout',institution:'中国国家博物馆',title:'白釉贴塑铺首衔环纹执壶',url:'https://www.chnmuseum.cn/zp/zpml/kgfjp/202112/t20211203_252543.shtml',facts:['器物有长流、曲柄、细长颈和壶盖，肩部饰铺首衔环。','长流便于控制注水；器形与宋代点茶需要相联系。']};
const tea:SourceEntry={id:'nmc-song-diancha',institution:'中国国家博物馆',title:'妇女涤器雕砖：宋代点茶说明',url:'https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200825_247299.shtml',facts:['点茶将茶末置于盏内，先用少量沸水调匀，再逐渐注水。','茶筅或茶匙环回击拂，使茶汤出现泡沫；不能把动画时长当作实际操作规范。']};
const qingming:SourceEntry={id:'dpm-qingming-song',institution:'故宫博物院',title:'张择端清明上河图卷',url:'https://www.dpm.org.cn/collection/paint/228226.html',facts:['北宋张择端画卷集中表现汴京城郊、汴河及街市，画面不是城址测绘图。','虹桥为木结构拱桥；桥下漕船正放倒桅杆准备通过。','临街大店设彩楼欢门，小店有敞棚；街市建筑与岸边活动为场景组织提供图像线索。']};
const structure:SourceEntry={id:'dpm-rainbow-bridge',institution:'故宫博物院 · 桥梁研究',title:'《清明上河图》上汴水贯木拱虹桥',url:'https://www.dpm.org.cn/study_detail/100191.html',facts:['研究通过画面与结构实践讨论贯木拱虹桥，成排木构形成桥下支承。','图像解读与复原试验不能等同于原桥的实测施工图。']};
const fuchun:SourceEntry={id:'npm-fuchun-wuyong',institution:'台北国立故宫博物院',title:'元黄公望富春山居图卷（无用师卷）',url:'https://digitalarchive.npm.gov.tw/Collection/Detail/1194?dep=P',facts:['无用师卷作于元代，1350年题识；画卷记录多年经营的山水意象。','画中山峦、坡岸、林木、房舍与舟楫相互组织，不是单一视点的地理测绘。','笔墨层次与水面空白共同构成画面节奏；三维模型只能是一种解释。']};
const pavilion:SourceEntry={id:'npm-fuchun-pavilions',institution:'台北国立故宫博物院 · 何传馨',title:'画中寓亭——黄公望与富春山居图',url:'https://www.npm.gov.tw/NewChineseArtDownload.ashx?bid=2345',facts:['文章讨论黄公望山水中亭、舍、树木和江岸的组织关系。','无用师卷中房屋、亭子、钓船与开阔江水穿插在山峦之间；此文亦包含其他作品，不可混作同一卷图像。']};

export const songExhibits:Exhibit[]=[{
 id:'song-yuan-living',eraId:'song-yuan',kind:'diancha',title:'盏中雪',subtitle:'宋代街角点茶',culture:'宋代茶器 · 汴京街市意象',question:'深色茶盏，为什么适合观察白色茶沫？',description:'走进街角敞棚，把细茶末送入黑釉盏，观察长流注水与击拂，让器形和点茶发生联系。',accent:'#62736a',ground:'#bbb29b',
 interpretation:'兔毫盏与长流执壶按国博实物照片自制，保留釉色、器形与构件关系，不是原物扫描，也不是同一套出土茶具。街角瓦屋、敞棚和高桌凳借《清明上河图》组织，尺寸、立面和摆设为推定，不复原某家宋代茶店。茶筅、茶末和泡沫为教学示意；省略操作者与烧水，不评价茶艺水平、不提供真实点茶的次数或时长标准。',sources:[bowl,pitcher,tea,qingming],objects:[
 {id:'bowl',name:'黑釉兔毫盏',kind:'馆藏器形线索',fact:'黑釉中的兔毫纹来自烧成结晶，深色盏面衬出茶沫。',detail:'模型保留敞口、收腹、短圈足、积釉和露胎边。细密纵向纹理自行绘制，只近似表现结晶，不是原器纹理复制。',position:[-.6,1.37,1.5],sourceIds:[bowl.id]},
 {id:'pitcher',name:'长流白釉执壶',kind:'馆藏器形线索',fact:'细长而上扬的流，让注水方向更容易控制。',detail:'注意细颈、盖、曲柄、长流和肩部铺首衔环。两件茶器在此教学组合，不能据此认定曾由同一人使用。动画把少量调膏和继续注水压缩为一段。',position:[.63,1.75,1.38],sourceIds:[pitcher.id,tea.id]},
 {id:'whisk',name:'茶筅与击拂',kind:'工艺示意',fact:'环回击拂把茶末、水和空气组织成有泡沫的茶汤。',detail:'茶筅用分束竹丝表达，移动展示击拂关系。泡沫是程序表现，不根据点击速度打分，也不声称达到历史文献中的某种茶艺境界。',position:[-1.55,1.3,1.8],sourceIds:[tea.id]},
 {id:'powder',name:'筛细的茶末',kind:'情境对象',fact:'点茶以备好的细茶末开始，并非直接放入整片茶叶。',detail:'小罐与匙具为自制道具。这里不重复唐代茶碾步骤；两处切片分别讲备茶器具和点茶方法，不代表每个时代只有一种饮茶方式。',position:[-1.75,1.27,1.12],sourceIds:[tea.id]},
 {id:'stall',name:'临街敞棚与高桌凳',kind:'画面线索与推定',fact:'敞开的店面把饮茶活动与街巷联系起来。',detail:'从北宋画卷的临街店铺、敞棚和高家具提取关系，重新布置转角茶棚。后部瓦屋、开窗、货架与炉灶属于场景推定，屋面局部退让以方便看见茶案。',position:[-1,1.8,-2.4],sourceIds:[qingming.id]}
 ],steps:[
 {id:'powder',label:'取茶末，轻送入盏',objectId:'bowl',duration:4.2,explanation:'茶末从罐边送入盏内；原料已预先备好，动画没有代替研磨和过筛。'},
 {id:'water',label:'提起长流壶，缓缓注水',objectId:'pitcher',duration:5.4,explanation:'先用少量水调匀，再注水；动画压缩这两段，只表现长流与控制水流的关系。'},
 {id:'whisk',label:'环回击拂，观察茶沫',objectId:'bowl',duration:5.5,explanation:'击拂后浅色泡沫浮在茶汤表面，黑釉提供对比。泡沫和所需时间均为示意。'}
 ],qa:[
 {question:'兔毫是画上去的吗？',answer:'不是。兔毫是黑釉烧成时形成的细密条状结晶，像兔毛般纤细。模型上的程序纹理只是帮助辨认外观。',sourceIds:[bowl.id]},
 {question:'为什么壶嘴这么长？',answer:'长流便于控制注水方向和流量，适应点茶逐渐注水的需要。模型另保留壶盖、曲柄和铺首衔环。',sourceIds:[pitcher.id,tea.id]},
 {question:'唐宋都这样喝茶吗？',answer:'不能把一个场景推广到所有人。这里用宋代器物和点茶说明讲一种方法；唐代切片主要表现碾、筛备茶及煎茶线索，时代内部也存在多种饮茶习惯。',sourceIds:[tea.id]}
 ]
},{
 id:'song-yuan-making',eraId:'song-yuan',kind:'bridge',title:'桥上桥下',subtitle:'虹桥与汴河船运',culture:'北宋 · 张择端画卷线索',question:'桥上要通行，桥下的大船又怎样通过？',description:'比较扩大河市与紧凑精细两版：走近木拱桥，观察两岸铺屋和装卸踏道，再倒下船桅，驶过桥孔。',accent:'#9b7751',ground:'#b8ac90',
 interpretation:'木桥、漕船和岸边敞棚参照故宫藏北宋张择端《清明上河图》的虹桥局部，重新组织为双岸河市。扩大版延长河段并增设街铺、泊船、装卸区；精细版保留紧凑地块，细化筒瓦、檐椽、格栅、绳结与船板。两层楼铺、人物服装和店招为艺术推定，不声称均位于原卷虹桥桥头。未照搬后世石拱桥或闽浙廊桥。桥梁节点、绳索受力、船舱、尺寸和运行路径均简化；移开桥面是教学剖视，不是历史开桥方法。模型不计算承重或水动力，人物是尺度示意，动画没有复原实际操船人力与绳索受力，不能说船自行航行。',sources:[qingming,structure],objects:[
 {id:'bridge',name:'贯木拱与桥面',kind:'画面结构示意',fact:'成排木构从两岸向上搭接，桥孔给水上交通留出空间。',detail:'当前用两组交错支承木和横梁表达结构关系，不是原桥的完整榫卯施工模型。操作时暂移桥面以看清木拱，完成后桥面归位。',position:[0,2.25,0],sourceIds:[qingming.id,structure.id]},
 {id:'mast',name:'可放倒的船桅',kind:'画面动作线索',fact:'画中桥下船只正在放倒桅杆，准备通过桥孔。',detail:'桅杆以底部连接点缓慢转下，帆已收拢。动作压缩，未完整表现水手协作与绳索受力；船体、桅杆高度是情境比例，不能推导真实净空。',position:[.3,1.2,3.3],sourceIds:[qingming.id]},
 {id:'boat',name:'河道里的运输船',kind:'自制情境模型',fact:'汴河船运与岸上的商贸在画面里紧密相连。',detail:'船舱、舷板、货包、木舵和篷顶帮助辨识货运情境，未复原某一艘宋船的船体线型。动画在倒桅后才允许通过。',position:[.25,.45,3.15],sourceIds:[qingming.id]},
 {id:'landing',name:'泊岸踏道',kind:'空间演绎',fact:'岸边需要为船只、货物和行人安排交接空间。',detail:'石砌踏道与木桩重新组织出一处停靠角落；位置与级数不对应画中实测尺寸，也不声称是已经发掘的宋代码头。',position:[3.6,.55,2.9],sourceIds:[qingming.id]},
 {id:'market',name:'桥头敞棚与街铺',kind:'建筑画面线索',fact:'桥头铺棚使过桥、沿岸与交易活动彼此交汇。',detail:'以北宋原卷的敞棚、瓦屋、木栏与商贸活动组织双岸。开放柜台、深出檐、铺前遮阳棚与楼层格栅强化河市特征。新增楼铺的位置、层数、店招和行人是艺术组合；不能据此推算历史人流或当年的准确店铺布局。',position:[-4.8,2.55,-2.5],sourceIds:[qingming.id]}
 ],steps:[
 {id:'structure',label:'移开桥面，看交错木拱',objectId:'bridge',duration:5.6,explanation:'教学剖视展示桥面下面的木构，随后复位；历史上并不是这样移动桥面通船。'},
 {id:'mast',label:'收帆倒桅，留出净空',objectId:'mast',duration:4.5,explanation:'船桅已放倒。此动作有画面线索，节点与绳索受力未完整复原。'},
 {id:'pass',label:'沿河前行，穿过桥孔',objectId:'boat',duration:6,explanation:'低下的桅杆随船通过桥下；航速和航线为教学预设，省略水手操船，不作工程验证。'}
 ],qa:[
 {question:'虹桥是石桥吗？',answer:'故宫所藏张择端北宋原卷中的虹桥是木结构桥。后世其他版本不能直接代替这卷画的结构证据；这里也没有套上廊桥屋顶。',sourceIds:[qingming.id]},
 {question:'桥面真的可以打开吗？',answer:'这里移开桥面是为了观察支承的教学剖视，没有史料说明这座桥这样开合。完成观察后模型会把桥面放回。',sourceIds:[structure.id]},
 {question:'为什么要放倒桅杆？',answer:'高桅会影响通过桥孔。故宫对画面的介绍明确提到漕船放倒桅杆准备过桥；动画的具体尺寸与速度则是自制示意。',sourceIds:[qingming.id]}
 ]
},{
 id:'song-yuan-culture',eraId:'song-yuan',kind:'landscape',title:'富春一隅',subtitle:'富春山居画境',culture:'元代 · 黄公望无用师卷',question:'没有画满的江面，为什么也是画的一部分？',description:'从一段自制水墨意象展开层叠山岸，观察疏林、茅舍与小舟，理解笔墨、远近和留白的关系。',accent:'#667269',ground:'#c9c2a9',
 interpretation:'依据台北故宫藏《富春山居图》无用师卷公开图像与说明创作，已对照卷中圆缓山峦、坡岸、疏林和房舍；不是子明卷，也不复制原卷高清图像。二维示意与三维山水均为项目自制，山峰、房舍与视点重新组合，不对应富春江的可测绘坐标。墨层由程序渐变展示，不模拟真实笔法；平面展开立体是解释手段，不能证明画家实际从同一视点作画。',sources:[fuchun,pavilion],objects:[
 {id:'mountain',name:'层叠的山势',kind:'画意空间演绎',fact:'山峦与坡岸在手卷中逐段展开，并非单一相机视角。',detail:'自制圆缓山体保留疏密与层次，山的高度和距离是艺术推定。第一步把压缩纵深的示意展开，帮助感受空间关系，不声称重建了实地地形。',position:[1.4,2.15,-2.2],sourceIds:[fuchun.id]},
 {id:'ink',name:'皴线与墨层',kind:'绘画语言示意',fact:'轮廓、皴线和浓淡变化共同塑造山石的层次。',detail:'第二步逐渐显出自行生成的皴线与墨点，用来讨论层次；没有把程序渲染当作黄公望的真实笔触，也没有替代原作鉴赏。',position:[-2,1.8,-1.8],sourceIds:[fuchun.id]},
 {id:'hut',name:'疏林间的茅舍',kind:'画面线索与推定',fact:'房舍与树木穿插，让山水中出现可想象的生活尺度。',detail:'坡岸小屋、木柱、低檐和简朴茅亭依据画面意象重新组合；不是元代民居标准图，不加入明清园林厅堂与装饰性飞檐。',position:[-3.75,.9,.65],sourceIds:[fuchun.id,pavilion.id]},
 {id:'river',name:'留白的江面',kind:'构图关系',fact:'水面的大块空白让密集的山树之间可以呼吸。',detail:'空白并不等于画面尚未完成。这里以淡色平面保留开阔水域，只用少量水线和小舟提示江面；不追求写实水面特效。',position:[.9,.02,2.9],sourceIds:[fuchun.id]},
 {id:'boat',name:'江上小舟',kind:'画意情境对象',fact:'小舟使宽阔江水与人的活动发生联系。',detail:'舟的形状、行进方向和钓竿均为自制意象，不识别画中人物身份。第三步沿江移动小舟，帮助比较舟、岸与远山的尺度。',position:[-1.5,.19,2.4],sourceIds:[fuchun.id,pavilion.id]}
 ],steps:[
 {id:'depth',label:'展开山岸，观察前后层次',objectId:'mountain',duration:5.5,explanation:'山岸从压缩纵深的示意逐渐展开，展示一种空间解释；不是画卷的唯一正确三维答案。'},
 {id:'ink',label:'叠加墨层，比较疏与密',objectId:'ink',duration:4.5,explanation:'自制皴线与墨点逐渐显现，帮助观察浓淡层次，不冒充原作笔触。'},
 {id:'river',label:'沿江观景，体会水面留白',objectId:'boat',duration:6,explanation:'小舟沿开阔江面前行，密集山林与空白水域形成对照；动画路线为艺术安排。'}
 ],qa:[
 {question:'这是富春江的真实地形吗？',answer:'不是。黄公望的画卷经营山水意象，当前模型又根据画面做了空间解释，不能当作历史地图或实地地形。',sourceIds:[fuchun.id]},
 {question:'江面空着是还没画完吗？',answer:'留白可以表现开阔的水面，与山、树、屋舍形成疏密节奏。这里的小舟和少量水线帮助你把空白读作江水。',sourceIds:[fuchun.id]},
 {question:'这些房子能代表所有元代民居吗？',answer:'不能。场景只是根据无用师卷的房舍、亭子与林岸关系做艺术组合，不是建筑测绘或通用元代住宅样式。',sourceIds:[fuchun.id,pavilion.id]}
 ]
}];
