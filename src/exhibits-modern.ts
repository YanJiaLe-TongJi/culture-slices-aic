import type {Exhibit} from './exhibits';
import type {SourceEntry} from './content';
const sewing:SourceEntry={id:'butterfly-treadle',institution:'上海蝴蝶牌缝纫机制造方',title:'传统家用缝纫机产品与结构照片',url:'https://butterfly-sewing.com/traditional.html',facts:['传统脚踏机有木台、铸铁架、脚踏板、皮带和手轮，机头与台架共同工作。','当前产品照片用于器类与外形参考，不能把其拍摄日期或现售机型当作1970年代出土实物。']};
const domestic:SourceEntry={id:'mofcom-butterfly-history',institution:'商务部老字号数字博物馆',title:'蝴蝶牌缝纫机',url:'https://lzhbwg.mofcom.gov.cn/edi_ecms_web_front/thb/detail/047b77d8642942f3b66c3d6b81d528d7',facts:['蝴蝶缝纫机在20世纪70年代受到欢迎，与当时家庭生活记忆相联系。','品牌沿革与1919年的缝纫机商号渊源应区分，不能说1919年已使用蝴蝶品牌。','缝纫机帮助家庭缝补制作衣物，但不意味着每个家庭都拥有。']};
const housing:SourceEntry={id:'yangpu-workers-home',institution:'上海市杨浦区人民政府',title:'看杨浦的家园巨变',url:'https://www.shyp.gov.cn/shypq/xwzx-bmdt/20230721/432947.html',facts:['长白一村是20世纪50年代首批两万户工人新村，房屋上下两层，以一室户为主。','五户共享厨、卫、浴服务功能，住宅与邻里共用设施相连。','场景只是局部生活剖面，不能由一间示意房推断整栋户型或所有住户条件。']};
const housingFabric:SourceEntry={id:'yangpu-housing-fabric',institution:'上海市杨浦区人民政府',title:'跨越70年，长白228街坊将这样焕新',url:'https://www.shyp.gov.cn/shypq/yqyw-jd-cbxc-sqzc-xwdt/20230410/425841.html',facts:['砖、木、玻璃，木门窗、高窗和洗手池等为旧住宅的材料与空间线索。','2023年的街坊含合并、复建和新元素，不能把商业改建后的玻璃顶当作旧时原貌。']};
const card:SourceEntry={id:'nmc-dasheng-card',institution:'中国国家博物馆',title:'大生纱厂使用过的英国梳棉机',url:'https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200826_247332.shtml',facts:['此机1895年由英国曼彻斯特赫瑟林顿公司制造，原由张之洞订购，后转给张謇筹办的大生纱厂，使用至20世纪70年代后期。','梳棉机把经清花的棉卷进一步开松梳理，经喇叭口集束、压成棉条，再圈入条筒。','梳棉与纺纱、织布不同，棉条后面还要进入并条等工序。']};
const mill:SourceEntry={id:'nantong-sawtooth-mill',institution:'南通市文化广电和旅游局',title:'大生纱厂工业遗存普查资料',url:'https://wglj.nantong.gov.cn/ntswgxj/bmdt/content/229310eb-5f37-4e9a-b50f-bdc969076455.htm',facts:['北车间为砖木锯齿形厂房，保存纺织机器及动力传动设备。','现存展示车间涉及1985年利用早期原构件迁建，不能直接等同1895年原平面。','场景提取锯齿采光、木架、砖墙、传动空间，不复刻真实生产线。']};
const projector:SourceEntry={id:'ccoea-f16-projector',institution:'中国文化办公设备制造行业协会',title:'长江牌F16-10型16mm电影放映机（2009）',url:'https://www.ccoea.org.cn/cp/Fequipment/20090904/20090904103202.html',facts:['F16-10是16mm氙灯电影放映设备，适用单位包括农村、工矿、学校等。','资料标注24格每秒、光学还音，放映机与音箱分开列出尺寸。','该页面为2009年产品资料，不能据此声称模型就是1952年首台国产16mm放映机。']};
const transition:SourceEntry={id:'cfa-film-digital-transition',institution:'国家电影局',title:'2010年农村16毫米电影放映向数字转换的历史通知',url:'https://www.chinafilm.gov.cn/xxgk/zcfg/gfxwj/ncdyfygc/201001/t20100121_1516.html',facts:['2010年的历史文件讨论农村16毫米胶片放映向数字放映转换。','胶片、放映机和数字设备属于不同媒介系统，不能由本演示推断当今所有放映仍使用胶片。']};
const club:SourceEntry={id:'huaian-workers-cinema',institution:'淮安政协文史网',title:'记忆中的淮安老工人文化宫',url:'https://zx.huaian.gov.cn/col/14070_116627/art/m/17277120/1729474109318frKEzpgg.html',facts:['老文化宫建于1952年，电影院1983年翻建；资料照片可见外台阶、平顶立面与大玻璃窗。','电影院旁有两层带走廊的活动楼，公共场地、树列、铁门连接入口。','老文化宫2007年被拆建；这里只借其建筑类型，不能声称2009资料的F16-10曾在该院放映。']};
export const modernExhibits:Exhibit[]=[{
 id:'modern-living',eraId:'modern',kind:'sewing',title:'针脚里的日常',subtitle:'工人新村缝纫角',culture:'20世纪后半叶上海 · 家庭缝纫与邻里生活',question:'脚下的一次摆动，怎样变成布上的一行针脚？',description:'在砖木住宅的生活剖面里，顺着脚踏、皮带和手轮观察传动，再让布片经过针下。',accent:'#65817a',ground:'#b4b6aa',interpretation:'住宅借长白一村两层砖木与共用设施关系重组，前墙、上层前部和部分屋面剖切，不复原指定住户。机器参照制造方传统脚踏机照片自行制作，不冒充已确定型号与年代的馆藏；不照搬品牌纹样。针、布与皮带连动仅示意原理，省略线迹形成的内部旋梭结构，不作为实际维修操作教程。',sources:[sewing,domestic,housing,housingFabric],objects:[
 {id:'machine',name:'脚踏缝纫机',kind:'器类结构参考',fact:'脚踏板通过传动带带动机头手轮，针随机构往复运动。',detail:'黑色机头、木台、侧轮和铸铁架共同组成一件生活工具。模型为器类示意，不宣称为某件定年的蝴蝶牌原机。',position:[-1.5,1.65,1.2],sourceIds:[sewing.id,domestic.id]},
 {id:'pedal',name:'脚踏板与传动带',kind:'传动原理示意',fact:'往复踩踏经过连杆和轮带，把运动传到机头。',detail:'脚板不是电开关。演示放慢动作以便观察，轮速、带长与曲柄尺寸并非制造图纸。',position:[-1.1,.75,1.25],sourceIds:[sewing.id]},
 {id:'cloth',name:'布片与针脚',kind:'缝补情境',fact:'机针上下运动，布料逐步移动，形成连续缝线。',detail:'用一行自制针迹表达缝合，内部梭芯和底线机构未完整演出；不能理解成一根针独自完成全部过程。',position:[-1.83,1.43,1.28],sourceIds:[sewing.id,domestic.id]},
 {id:'room',name:'一室户生活角',kind:'住宅类型线索',fact:'一间房可能兼顾休息、收纳与日常劳动。',detail:'从两层一室户住宅提取局部，桌柜床铺为情境布置，不是某户原物。二层和屋面被剖开便于观看。',position:[-.2,1.9,-1.65],sourceIds:[housing.id,housingFabric.id]},
 {id:'yard',name:'共用水池与巷口',kind:'邻里空间',fact:'部分生活设施由邻里共享，室内与户外彼此相连。',detail:'资料中的五户共享厨卫不能简化成每户都有独立卫生间；水池、管道、晾晒位置属于教学布局。',position:[3.7,.9,1.5],sourceIds:[housing.id,housingFabric.id]}
 ],steps:[
 {id:'wheel',label:'转动手轮，观察机针',objectId:'machine',duration:5,explanation:'手轮转动带动机针往复。放慢的展示没有完整表现底线与旋梭机构。'},
 {id:'treadle',label:'摆动脚踏，接通传动',objectId:'pedal',duration:5,explanation:'脚踏板、连杆、下轮、皮带与上轮共同传递运动，不需要把脚踏机误认为电动机。'},
 {id:'stitch',label:'送过布片，留下一行针脚',objectId:'cloth',duration:5.5,explanation:'布片平稳通过针下，自制线迹随操作出现；完整缝合还涉及未展开的内部机构。'}
 ],qa:[
 {question:'脚踏机不用电也能缝吗？',answer:'这种脚踏结构由人踩踏驱动，连杆与轮带把运动传给机头。模型把轮带和针放慢展示，便于看清关系。',sourceIds:[sewing.id]},
 {question:'当时每家都有缝纫机吗？',answer:'不能这样推断。它是20世纪后半叶常见的家庭生活记忆，但家庭条件不同；这里展示一种可能的缝补角落。',sourceIds:[domestic.id,housing.id]},
 {question:'这是长白一村原来的某一户吗？',answer:'不是。住宅借两层一室户和共用设施的资料重新组织，机器和家具没有来自同一户的证据。',sourceIds:[housing.id,housingFabric.id]}
 ]
},{
 id:'modern-making',eraId:'modern',kind:'carding',title:'棉花成条',subtitle:'大生纱厂梳棉工场',culture:'近代南通工业 · 1895年梳棉机线索',question:'松散的棉花，怎样走向整齐的棉条？',description:'走进砖木锯齿厂房，沿喂棉、大滚筒、集束到条筒观察加工关系，区分梳棉和纺纱。',accent:'#65776b',ground:'#b1a695',interpretation:'机器按国博公开实物照自制，保留大锡林、盖板、小滚筒、侧轮、铁架和独立圈条装置，细齿与内部结构简化。北车间的迁建因素已标注，厂房和机器位置是教学组合，不是1895年原平面。可见棉流与局部开盖为讲解层，原机不会透明；传动和颜色变化不代表真实工厂的速度与安全操作。',sources:[card,mill],objects:[
 {id:'carder',name:'盖板与大滚筒',kind:'馆藏机器形制',fact:'梳理区把经过前道处理的棉纤维进一步分梳。',detail:'大滚筒与上方紧密排列的盖板共同形成机器特征。实物1895年英国制造，不能说是张謇发明或大生自主制造。',position:[-.4,1.5,.1],sourceIds:[card.id]},
 {id:'feed',name:'喂入的棉卷',kind:'工序起点示意',fact:'喂入的是已经过清花等前道处理的棉卷。',detail:'动画将棉卷平缓送入，用色带提示路线，不把田里刚采下的带籽棉直接变为纱。',position:[-.4,1.05,-1.15],sourceIds:[card.id]},
 {id:'sliver',name:'集束与圈条筒',kind:'工序结果示意',fact:'棉网经过集束、压成棉条，再圈入条筒。',detail:'条筒里的粗棉条尚不是可织布的成纱，后面还要并条等加工。旁边独立支架参照实物的圈条装置。',position:[1.25,1.1,2.3],sourceIds:[card.id]},
 {id:'drive',name:'轮带与传动架',kind:'工业情境示意',fact:'机器加工与动力传动、厂房空间相互配合。',detail:'侧轮、皮带和上部轴系表达机械动力关系，轮数、布置与动力来源没有完整测绘依据，不宣称逐齿还原。',position:[1.4,1.25,.2],sourceIds:[card.id,mill.id]},
 {id:'factory',name:'锯齿采光厂房',kind:'工业建筑类型',fact:'砖木锯齿形屋面与厂内机械共同构成工业空间。',detail:'后部保留高窗和木桁架，前段剖切展示。现存北车间涉及1985年迁建，不能当作1895年完整原貌。',position:[0,2.2,-2.8],sourceIds:[mill.id]}
 ],steps:[
 {id:'feed',label:'送入棉卷，查看起点',objectId:'feed',duration:5,explanation:'已经过前道处理的棉卷进入梳棉机；不是带籽棉直接变成纱。'},
 {id:'card',label:'展开梳理区，观察棉流',objectId:'carder',duration:5.5,explanation:'局部盖板展示性抬起，棉流沿大滚筒与小滚筒变化，实际运行机器不会这样开盖。'},
 {id:'coil',label:'集束成条，圈入条筒',objectId:'sliver',duration:5.5,explanation:'棉网收为棉条并进入条筒。梳棉到此形成半成品，纺纱与织布尚未发生。'}
 ],qa:[
 {question:'这台机器是张謇发明的吗？',answer:'不是。国博说明它1895年由英国曼彻斯特的赫瑟林顿公司制造，后来转用于张謇筹办的大生纱厂。制造、购置和使用是不同的历史关系。',sourceIds:[card.id]},
 {question:'棉条出来就能织布了吗？',answer:'还不能。梳棉得到的是棉条，后面还要并条等工序再走向纺纱；织布是另一阶段。',sourceIds:[card.id]},
 {question:'屋顶为什么像锯齿？',answer:'这类厂房以重复的斜屋面和较高窗面组织采光。南通资料记录北车间为砖木锯齿形厂房，但现存迁建情况不能被省略。场景未复原其准确窗向和原始尺寸。',sourceIds:[mill.id]}
 ]
},{
 id:'modern-culture',eraId:'modern',kind:'cinema',title:'幕前相聚',subtitle:'公共场地流动放映',culture:'20世纪末至21世纪初 · 胶片媒介情境',question:'一卷静止的小画面，怎样成为银幕上的运动？',description:'从片盘、胶片路径和镜头走到银幕，观看自制图形动起来，理解工具怎样组织共同观看。',accent:'#6e7b92',ground:'#aeb1aa',interpretation:'放映机依据行业协会2009年F16-10照片，不能称1952原机；片路为简化讲解，不作为穿片操作教程。公共建筑借淮安1983年翻建后电影院立面类型重新设计；原文化宫2007年已拆，不声称这台机器实际在那里放映。场地、凳位与临时银幕为组合，画面是自制几何短动画，不使用历史电影片段。',sources:[projector,transition,club],objects:[
 {id:'projector',name:'双片盘放映机',kind:'设备照片参考',fact:'供片、片路、镜头与收片共同服务胶片放映。',detail:'参照F16-10器类的机体、双盘和分体音箱，自行建模。2009资料不能冒充1952首台国产机的证明。',position:[.1,1.62,2.2],sourceIds:[projector.id]},
 {id:'film',name:'片格与齿孔',kind:'媒介原理示意',fact:'胶片上连续排列着单幅画面，放映机构控制它们依次经过片门。',detail:'放大样带解释片格和输送关系，机内片路省略细节。整体时间放慢，不能将连续转盘理解成片门从不间歇。',position:[-2.6,1.25,1.8],sourceIds:[projector.id]},
 {id:'screen',name:'临时银幕',kind:'自制动画演示',fact:'光线把胶片图像投到银幕，连续画面呈现运动。',detail:'示范用自制月亮与小舟图形，不复制历史影片；页面不闪烁模拟真实遮光器。光束是教学提示，空气不会总是显出这样的光锥。',position:[0,2.5,-1.8],sourceIds:[projector.id]},
 {id:'speaker',name:'分体音箱与看台',kind:'共同观看情境',fact:'放映与声音设备、观众座位一起组织观看。',detail:'参考设备资料有光学还音与单列音箱；当前只呈现结构，不播放影片音轨。座位和摆放是情境设计。',position:[3.0,.75,.4],sourceIds:[projector.id,club.id]},
 {id:'square',name:'文化建筑前的公共场地',kind:'建筑类型与媒介变化',fact:'共同观看也与活动建筑、场地和入口相连。',detail:'后部玻璃立面与外台阶借淮安文化建筑资料，不是该院测绘复原。历史16毫米放映逐步向数字转换，不代表当今仍统一使用胶片。',position:[-1.0,2.6,-4.0],sourceIds:[club.id,transition.id]}
 ],steps:[
 {id:'thread',label:'沿片盘查看胶片路径',objectId:'projector',duration:5,explanation:'供片盘、片门附近和收片盘之间的示意路径逐段亮起；不是实际穿片教学。'},
 {id:'light',label:'打开光路，照亮银幕',objectId:'screen',duration:5,explanation:'光束和银幕缓缓显现，图形为自制演示，不是历史电影录像。'},
 {id:'motion',label:'连续放映，让画面动起来',objectId:'screen',duration:6,explanation:'片盘转动，自制小舟图形移动。F16-10资料为24格每秒，当前演示不闪烁复现片门遮光。'}
 ],qa:[
 {question:'这是1952年的第一台国产放映机吗？',answer:'不是。造型参考的是2009年资料里的长江F16-10，不能与1952年的第一台国产16毫米机混同。',sourceIds:[projector.id]},
 {question:'为什么一张张图片会动？',answer:'胶片把连续动作分成一格格图像，机构依次送过片门并投射出来。参考机资料标明24格每秒；这里用不闪烁的自制动画解释连续画面的效果。',sourceIds:[projector.id]},
 {question:'现在放电影也都要胶片吗？',answer:'不是。国家电影局2010年的历史文件就涉及农村16毫米放映向数字转换；本场景关注胶片时代的一种体验，不代表今天的通用设备。',sourceIds:[transition.id]}
 ]
}];
