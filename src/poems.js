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
