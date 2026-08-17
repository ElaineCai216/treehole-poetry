// 树洞诗集 · 本地诗库
// 每类情绪约 10 首，现代诗 4-8 行与古风四句混合。
// 文本用 \n 分行；style: "modern" | "classical"

const POEMS = {
  happy: [
    {
      style: "modern",
      text: "阳光落在窗台上\n像一只温顺的猫\n今天的一切\n都刚刚好",
    },
    {
      style: "modern",
      text: "风把云吹成棉花糖\n我把日子过成糖\n嘴角藏不住的笑意\n是今天最好的天气",
    },
    {
      style: "modern",
      text: "路过花店\n买了一束春天\n路过人间\n被温柔撞了个满怀",
    },
    {
      style: "modern",
      text: "好消息乘着风来\n连空气都是甜的\n我走在这座城市里\n开心得像个孩子",
    },
    {
      style: "modern",
      text: "今天的开心\n像口袋里突然多出的硬币\n叮当作响\n整条路都亮了起来",
    },
    {
      style: "modern",
      text: "天空很蓝\n云很软\n我在路上走着\n心里开满了花",
    },
    {
      style: "classical",
      text: "春风拂我衣\n花香满袖归\n今朝心欢喜\n笑与白云飞",
    },
    {
      style: "classical",
      text: "晴日暖风轻\n枝头雀鸟鸣\n心头无挂碍\n万事皆称情",
    },
    {
      style: "classical",
      text: "小桥流水畔\n我与春风闲\n人间多喜事\n都在眉眼间",
    },
    {
      style: "classical",
      text: "今日天气好\n出门遇故人\n相视一笑里\n春风满乾坤",
    },
    {
      style: "modern",
      text: "今天的风\n都是我的\n脚步很轻\n像踩在云端",
    },
    {
      style: "modern",
      text: "买了一串气球\n分给路过的小孩\n他们笑\n我也笑\n原来快乐会传染",
    },
    {
      style: "modern",
      text: "把好消息\n装进口袋\n走路的时候\n它们叮叮当当\n陪我回家",
    },
    {
      style: "modern",
      text: "阳光晒在肩上\n暖暖的\n我忽然觉得\n人间值得",
    },
    {
      style: "modern",
      text: "喜欢的歌\n刚好循环到\n最爱的那句\n今天运气真好",
    },
    {
      style: "modern",
      text: "日历上画个圈\n是见面的日子\n倒计时的每一天\n都亮晶晶",
    },
    {
      style: "classical",
      text: "喜鹊枝头叫\n春风入户来\n万事皆如意\n笑口常常开",
    },
    {
      style: "classical",
      text: "好景正当时\n花开满故枝\n人间欢乐事\n皆在此心知",
    },
  ],
  calm: [
    {
      style: "modern",
      text: "茶凉了\n我也没有急着续\n风把窗帘吹成波浪\n日子就这样慢慢过去",
    },
    {
      style: "modern",
      text: "坐在树下\n看蚂蚁搬家\n一整个下午\n世界没有催促我",
    },
    {
      style: "modern",
      text: "雨声细细\n落在青瓦上\n我把所有的话\n都还给安静",
    },
    {
      style: "modern",
      text: "黄昏的光\n洒在旧书上\n翻到哪一页\n就在哪一页停下",
    },
    {
      style: "modern",
      text: "水很慢\n云很慢\n我的心\n慢成了一片湖",
    },
    {
      style: "modern",
      text: "灯下\n影子也安稳\n此刻无事\n便是好时辰",
    },
    {
      style: "classical",
      text: "空山新雨过\n独坐听松声\n心静如秋水\n不惊也不争",
    },
    {
      style: "classical",
      text: "晚来天欲雪\n闲坐一炉温\n无悲亦无喜\n静听夜更深",
    },
    {
      style: "classical",
      text: "竹影映窗纱\n茶烟绕晚霞\n浮生半日静\n心远自安家",
    },
    {
      style: "classical",
      text: "江上清风来\n山间明月白\n此心无所住\n自在且悠哉",
    },
    {
      style: "modern",
      text: "云在天上\n水在河里\n我在椅子上\n什么都不想",
    },
    {
      style: "modern",
      text: "黄昏的光\n慢慢爬上墙\n我没有开灯\n和影子一起安静",
    },
    {
      style: "modern",
      text: "煮一壶水\n看它冒泡泡\n再等它凉\n时间刚好",
    },
    {
      style: "modern",
      text: "风停了\n树叶也不动\n我把手机放下\n世界更轻了",
    },
    {
      style: "modern",
      text: "睡了个长长的午觉\n醒来窗外还亮着\n这一觉\n把心事都睡软了",
    },
    {
      style: "modern",
      text: "慢慢走路\n慢慢吃饭\n慢慢把日子\n过成一首慢歌",
    },
    {
      style: "classical",
      text: "闲来无事坐\n静看水流东\n此心常自在\n不与世争锋",
    },
    {
      style: "classical",
      text: "明月照清泉\n微风拂柳烟\n心宽天地阔\n无事小神仙",
    },
  ],
  sad: [
    {
      style: "modern",
      text: "雨下了很久\n窗子一直没关\n有些话咽下去\n就变成了天气",
    },
    {
      style: "modern",
      text: "今天有点难过\n没有特别的理由\n像一只气球\n慢慢漏光了气",
    },
    {
      style: "modern",
      text: "把眼泪借给雨\n把沉默还给夜\n天亮以前\n请让我一个人待一会儿",
    },
    {
      style: "modern",
      text: "世界上那么多人\n我却弄丢了\n那个重要的名字\n像丢掉一把伞",
    },
    {
      style: "modern",
      text: "难过的时候\n就把灯关掉\n黑暗会接住我\n轻轻的，不吵",
    },
    {
      style: "modern",
      text: "花谢了\n没有告别\n我站在原地\n等风把我吹走",
    },
    {
      style: "classical",
      text: "夜雨敲窗冷\n孤灯照影寒\n心头千般事\n说与谁人看",
    },
    {
      style: "classical",
      text: "落花人独立\n微雨燕双飞\n旧事如烟散\n空留泪满衣",
    },
    {
      style: "classical",
      text: "独坐黄昏后\n残阳照空楼\n往事不可追\n此恨几时休",
    },
    {
      style: "classical",
      text: "秋风起叶落\n客子泪沾巾\n故园千里外\n何处寄此身",
    },
    {
      style: "modern",
      text: "今天把伞丢了\n雨还下着\n我站在屋檐下\n等雨停\n也等自己好起来",
    },
    {
      style: "modern",
      text: "有些话没说出口\n就过期了\n像昨晚的月亮\n天亮就看不见",
    },
    {
      style: "modern",
      text: "难过的时候\n世界变得很大\n我一个人\n要走很久",
    },
    {
      style: "modern",
      text: "把歌单切到慢歌\n把灯光调暗\n今天允许自己\n难过一小会儿",
    },
    {
      style: "modern",
      text: "眼泪掉进水里\n分不清\n哪一颗是雨\n哪一颗是我",
    },
    {
      style: "modern",
      text: "窗外的树\n叶子落了一半\n原来告别\n是一点一点发生的",
    },
    {
      style: "classical",
      text: "孤雁南飞去\n空留半窗秋\n心事无人问\n冷雨下不休",
    },
    {
      style: "classical",
      text: "暮色入寒林\n残花落满襟\n人间多少事\n都作泪痕深",
    },
  ],
  tired: [
    {
      style: "modern",
      text: "今天像跑完一场长跑\n身体的每个角落\n都在小声说\n想休息了",
    },
    {
      style: "modern",
      text: "把白天还给人间\n把夜晚留给自己\n灯熄了\n世界请安静",
    },
    {
      style: "modern",
      text: "好累啊\n连叹气都省着力气\n先睡一觉\n明天的事明天再说",
    },
    {
      style: "modern",
      text: "地铁的末班车\n载着我\n和一身疲惫\n窗外的城市缓缓退去",
    },
    {
      style: "modern",
      text: "肩膀上的重量\n暂时放一放吧\n树洞在这里\n你可以靠一会儿",
    },
    {
      style: "modern",
      text: "困意像潮水\n漫过脚踝\n漫过膝盖\n慢慢地把我淹没",
    },
    {
      style: "classical",
      text: "日暮归途远\n倦鸟入林深\n一身风尘重\n卸与梦里人",
    },
    {
      style: "classical",
      text: "奔走红尘久\n身心两俱疲\n幸有今夜月\n照我缓缓归",
    },
    {
      style: "classical",
      text: "劳劳尘世路\n步步踏风霜\n且枕青山睡\n明朝再启航",
    },
    {
      style: "classical",
      text: "身倦倚窗前\n灯火照残年\n不问今朝事\n先得一夜眠",
    },
    {
      style: "modern",
      text: "今天的我\n像一根用旧的数据线\n明明还在\n却传不动任何消息",
    },
    {
      style: "modern",
      text: "把鞋脱掉\n把包放下\n把今天所有的加油\n都换成辛苦了",
    },
    {
      style: "modern",
      text: "眼皮很重\n星星很轻\n我先睡一步\n明天见",
    },
    {
      style: "modern",
      text: "地铁里靠着门\n差点睡着\n醒来发现\n坐过了三站",
    },
    {
      style: "modern",
      text: "热水澡\n热牛奶\n暖和的被子\n今天到此为止",
    },
    {
      style: "modern",
      text: "像一片叶子\n在秋天打了个盹\n别叫醒我\n再睡一会儿",
    },
    {
      style: "classical",
      text: "倦鸟归林晚\n斜阳照影长\n风尘都落尽\n一夜入梦乡",
    },
    {
      style: "classical",
      text: "奔波劳碌久\n方知闲最真\n今宵且安睡\n明朝再起身",
    },
  ],
  anxious: [
    {
      style: "modern",
      text: "心里有一团雾\n看不清前路\n我站在原地\n等风来吹散",
    },
    {
      style: "modern",
      text: "明天的答案\n还没有寄到\n今晚的我\n先和忐忑握手言和",
    },
    {
      style: "modern",
      text: "想得太多\n路就走不动了\n深呼吸\n一次，再一次",
    },
    {
      style: "modern",
      text: "心跳快了一拍\n又慢了一拍\n没关系\n情绪只是路过",
    },
    {
      style: "modern",
      text: "把担心写下来\n放进树洞\n等天亮\n它们会轻一些",
    },
    {
      style: "modern",
      text: "迷雾里的路\n看不清也没关系\n走一步\n亮一步",
    },
    {
      style: "classical",
      text: "前路迷烟雾\n心焦夜未眠\n且看云开处\n自有月明天",
    },
    {
      style: "classical",
      text: "心事重重叠\n眉间几度深\n静坐观流水\n一洗万虑清",
    },
    {
      style: "classical",
      text: "乱云遮远岫\n急雨打孤舟\n莫惧风浪起\n心安自不愁",
    },
    {
      style: "classical",
      text: "夜深人未静\n思绪乱如麻\n待到晨光现\n尘埃自落花",
    },
    {
      style: "modern",
      text: "心里有个小漩涡\n转啊转\n我把手伸进去\n把万一捞出来",
    },
    {
      style: "modern",
      text: "明天的门还没开\n我在门口\n来回走了很久\n原来等待\n也是向前",
    },
    {
      style: "modern",
      text: "担心像气球\n越吹越大\n轻轻放一点气\n它就没有那么可怕",
    },
    {
      style: "modern",
      text: "把事情一件一件\n写下来\n再一件一件\n划掉",
    },
    {
      style: "modern",
      text: "深呼吸三次\n数到十\n世界没有变\n但心安静了一点",
    },
    {
      style: "modern",
      text: "迷雾里走路\n看不清十步以外\n那就不看那么远\n先看好脚下",
    },
    {
      style: "classical",
      text: "心绪乱如麻\n且饮一盏茶\n万事皆有序\n何必自惊哗",
    },
    {
      style: "classical",
      text: "云开终见月\n水落自有石\n莫被一时雾\n迷了心中尺",
    },
  ],
  missing: [
    {
      style: "modern",
      text: "月亮升起来的时候\n我总会想起你\n像想起\n一个温柔的地名",
    },
    {
      style: "modern",
      text: "今天的晚霞很好看\n我拍了下来\n却不知道\n该发给谁",
    },
    {
      style: "modern",
      text: "想念是\n突然安静下来的风\n是我开口之前\n先红了眼眶",
    },
    {
      style: "modern",
      text: "你不在的日子\n日子还是照常过\n只是遇到好看的东西\n会多想看两眼",
    },
    {
      style: "modern",
      text: "梦里你回来了\n我们说了很多话\n醒来只有\n枕头上的凉",
    },
    {
      style: "modern",
      text: "距离很远\n思念很近\n近到一闭眼\n就能看见你",
    },
    {
      style: "classical",
      text: "千里寄明月\n相思入梦来\n故人今何在\n云深不见回",
    },
    {
      style: "classical",
      text: "登高望故乡\n烟水两茫茫\n不见故人面\n空余泪两行",
    },
    {
      style: "classical",
      text: "夜夜思君切\n灯花落又明\n山长水远路\n何处寄深情",
    },
    {
      style: "classical",
      text: "独倚小窗前\n望月忆当年\n音书久不至\n愁绪满心田",
    },
    {
      style: "modern",
      text: "看到一家老店\n是我们一起去过的\n我没进去\n只在门口\n站了很久",
    },
    {
      style: "modern",
      text: "天气预报说\n你那边降温了\n我把那行字\n看了三遍",
    },
    {
      style: "modern",
      text: "家里的猫\n又在你的椅子上打盹\n它大概\n也在想你",
    },
    {
      style: "modern",
      text: "整理旧照片\n停在你笑的那张\n时间过去了\n笑还在",
    },
    {
      style: "modern",
      text: "吃到好吃的东西\n第一反应是\n下次带你来\n然后突然想起\n你在很远的地方",
    },
    {
      style: "modern",
      text: "写了一半的信\n又不知道从哪句开始\n原来想念\n是说不出的话",
    },
    {
      style: "classical",
      text: "思君如满月\n夜夜减清辉\n何时能相见\n共看雪花飞",
    },
    {
      style: "classical",
      text: "故园春草绿\n游子泪沾衣\n梦醒人不见\n窗外月凄迷",
    },
  ],
  lonely: [
    {
      style: "modern",
      text: "路灯亮起\n又熄灭\n我数着影子\n数到第三个",
    },
    {
      style: "modern",
      text: "一个人吃饭\n一个人回家\n城市很大\n热闹都与我无关",
    },
    {
      style: "modern",
      text: "手机亮着\n没有消息\n我把屏幕按灭\n假装睡得很好",
    },
    {
      style: "modern",
      text: "深夜的房间里\n只有我和呼吸\n时钟滴答\n陪我说话",
    },
    {
      style: "modern",
      text: "人群散了\n灯也关了\n我站在路口\n等一个不会来的人",
    },
    {
      style: "modern",
      text: "孤独不是没人陪\n是热闹里\n我突然安静下来\n像人群中的一片雪",
    },
    {
      style: "classical",
      text: "空庭人独坐\n明月照孤影\n四顾无人语\n唯闻落叶声",
    },
    {
      style: "classical",
      text: "独宿孤灯下\n长夜漫漫愁\n无人知我意\n唯有月如钩",
    },
    {
      style: "classical",
      text: "孤舟泊寒江\n雁影过西窗\n此身何所似\n天地一沙鸥",
    },
    {
      style: "classical",
      text: "独行深巷里\n犬吠与虫鸣\n灯火人家处\n无人唤我名",
    },
    {
      style: "modern",
      text: "屏幕熄灭之后\n房间安静得像深水\n我沉在海底\n数自己的心跳",
    },
    {
      style: "modern",
      text: "节日里的消息\n热闹地响\n没有一条\n是给我的",
    },
    {
      style: "modern",
      text: "一个人也可以\n煮两人份的面\n然后\n假装在等谁",
    },
    {
      style: "modern",
      text: "楼下的灯\n一盏一盏熄灭\n我的房间\n还在亮着",
    },
    {
      style: "modern",
      text: "和影子说晚安\n它比我先躺下\n原来影子\n也会累",
    },
    {
      style: "modern",
      text: "把喜欢的歌\n放得很大声\n热闹一点\n就没那么空",
    },
    {
      style: "classical",
      text: "夜深人独坐\n灯影共伶仃\n窗外繁华处\n皆与我无情",
    },
    {
      style: "classical",
      text: "独行天地间\n风雪满衣肩\n无人共言语\n且与影谈天",
    },
  ],
  angry: [
    {
      style: "modern",
      text: "心里的火\n烧到了嗓子眼\n我把它咽下去\n变成一声叹息",
    },
    {
      style: "modern",
      text: "今天受了点委屈\n想大声说话\n又怕吓着\n身边温柔的人",
    },
    {
      style: "modern",
      text: "火气上来的时候\n先停三秒\n把话在嘴里\n过一遍凉水",
    },
    {
      style: "modern",
      text: "不是所有的事\n都值得生气\n把力气留给\n值得的事",
    },
    {
      style: "modern",
      text: "胸口闷着一团火\n烧得难受\n我把它吹熄\n像吹灭一根蜡烛",
    },
    {
      style: "modern",
      text: "生气归生气\n别忘了\n明天太阳照常升起\n我先去喝口水",
    },
    {
      style: "classical",
      text: "怒火上心头\n言语似刀锋\n三思而后语\n方免两相伤",
    },
    {
      style: "classical",
      text: "胸中一团火\n烧尽不自知\n且饮一杯水\n心平万事迟",
    },
    {
      style: "classical",
      text: "恼人心头起\n怒气上眉梢\n静看云舒卷\n烦恼自逍遥",
    },
    {
      style: "classical",
      text: "不平事常有\n何必尽挂怀\n放宽一寸心\n海阔又天空",
    },
    {
      style: "modern",
      text: "火气上来的时候\n先离开现场\n去接一杯水\n水是凉的\n心也慢慢凉下来",
    },
    {
      style: "modern",
      text: "被不讲理的人气到\n想说很多话\n后来发现\n和讲不通的人\n不必讲",
    },
    {
      style: "modern",
      text: "生气的时候照镜子\n脸红红的\n像一颗\n熟透的番茄",
    },
    {
      style: "modern",
      text: "把想骂的话\n写在纸上\n再揉成一团\n扔进垃圾桶\n心里轻了一点点",
    },
    {
      style: "modern",
      text: "世界有时不讲理\n但我不打算\n和它一起\n不讲理",
    },
    {
      style: "modern",
      text: "深呼吸\n把凭什么三个字\n先放一放\n等风把火吹小\n再说",
    },
    {
      style: "classical",
      text: "怒火烧心际\n且念一口气\n退后三步看\n方知天地宽",
    },
    {
      style: "classical",
      text: "不平万事有\n何苦气难平\n心中有山海\n自是不波澜",
    },
  ],
};

export const EMOTION_IDS = Object.keys(POEMS);

export function allPoems() {
  return EMOTION_IDS.flatMap((id) => POEMS[id]);
}

// 随机抽一首；emotion 未知或为空时从全库抽取
export function randomPoem(emotion) {
  const pool = emotion && POEMS[emotion] && POEMS[emotion].length ? POEMS[emotion] : allPoems();
  return pool[Math.floor(Math.random() * pool.length)];
}

// 从某一情绪的库里抽一首与上一次不同的（尽力避免连抽重复）
export function randomPoemExcept(emotion, previous) {
  if (!previous) return randomPoem(emotion);
  for (let i = 0; i < 12; i++) {
    const p = randomPoem(emotion);
    if (p.text !== previous.text) return p;
  }
  return randomPoem(emotion);
}

export default POEMS;
