import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {Maths} from "../../../core/utils/Maths";

export const list = {
  "post": [
    "大家好，我是秦始皇，其实我并没有死，我在西安有100000吨黄金，今天肯德基疯狂星期四，我现在需要有人来请我吃29.9块钱8只蛋挞。我明天直接带部队复活，让你统领三军! ​​​",
    "花2000w可以让lex账号解封\n花200w可以让hololive回归\n花20w可以给东雪莲上10个月总督\n花2w可以让女生不用在厕所生孩子\n花2000可以去华东理工大学买一副耳机\n花200可以买一副VR眼睛在厕所求导\n那花50呢？能让我愉快的渡过一个疯狂星期四吗？\n可以，KFC疯狂星期四鸡排桶仅需49.9！\nV我50，助我渡过一个快乐的疯狂星期四！",
    "我是盗号的 我把这个人的号盗了 但是我看了这个人的聊天记录 发现他过得非常艰苦 他的吃住一直很烂 我看到大家的生活都很富足 我希望有人看见了能救济他一下 请他吃一顿肯德基疯狂星期四 就这样吧 眼眶都湿润了 我下了",
    "离婚这么多年了，竟然在群里遇到你了，你过得挺好我也就放心了。孩子上四年级了，成绩一直都很好，连续三年拿班上第一名，就是性格像你，每次生气就逃避，孩子总问妈妈什么时候来参加家长会！有时间就来看看孩子吧，多陪陪孩子，孩子今天想吃肯德基，因为今天是肯德基疯狂星期四，v我40，我请孩子吃。",
    "扒个群里的渣男，我有个朋友被群友睡了，大概在三个月以前吧，我朋友在群里认识了一个男的，他们在网上聊了差不多两个星期左右就见面了，而且第一次见面就去了宾馆，之后的每个星期六日都会去，就这样持续了好几个月。我朋友给那个男的说，已经一个多月没来大姨妈了，想不到这句话说完，隔天就找不到男的了，手机一直打不通，关机，直到我朋友前几天跟父母坦白这件事情，那天晚上我偷偷给她买了验孕棒一看，真怀孕了。然后我第二天请假一天，专门跟她聊这个事，她说那个男的对她很好很好什么的，我说对你好还不是想玩你，实在不行就报警吧。她当时听完这句话就趴桌子上大哭。正当我打开手机想报警的时候，不小心打开了肯德基，想起来今天原来是疯狂星期四，所以说谁请我肯德基？吃完我继续说",
    "实不相瞒我结婚七年了，他不爱我也不放过我，孩子从小被H集团幕后掌托人也就是他爷爷奶奶带走，所有人都阻拦我见孩子，一场车祸我失去了所有记忆，只记得我好想他，夜不能寐，茶饭不思，寝食难安，重复做着我带着他去吃肯德基疯狂星期四的梦，所以能请我吃肯德基疯狂星期四帮我恢复丢失的记忆吗……",
    "袜！好神奇的功能耶！私信给我发送“疯狂星期四”就可以得到我的一句“你请我吃”！真的好神奇！！友友们快来试试吧！！！",
    "狗的叫声是汪汪汪 猫的叫声是喵喵喵 牛的叫声是all I want for Christmas is you  星期四的叫声是抽一位幸运儿请我肯德基疯狂星期四",
    "我都明白 我是选项E 我是planB 是分叉的头发 洗衣机流出的泡沫 超市里被捏碎的饼干 是吃腻的奶油 是落寞的城市 是地上的草 我是被踩踏的 是西装的备用扣 是被雨淋湿的小狗  是腐烂的橘子 是过期的牛奶 是断线的风筝 是被随意丢弃的向日葵 是沉默寡言的小朋友 所以能v我40吗 今天肯德基疯狂星期四",
    "穿过挪威的森林，让我走进你的梦里，夕阳落在我的铠甲，王子不一定骑白马，现在是中午十二点四十四分，你不必故作冷淡，我也不想做最后的纠缠。最后问一句，疯狂星期四，谁请我吃肯德基？",
    "刚给女朋友洗完衣服 手搓的 平时洗之前手要消5遍毒 今天因为漏了一遍被女朋友打了两巴掌 现在心里有点委屈 今天我决定反击疯狂星期四 吮指原味鸡9.9两块 葡式蛋挞 8块29.9 黄金鸡块20块19.9谁请我吃 我边吃边跟你说我平时在家里都怎么受罪的",
    "肯德基给你们多少钱了，让你们周周给编段子，疯狂星期四真的那么有诱惑力？我偏不信，v我50，我去试试",
    "我本是显赫世家的奥特曼，却被诡计多端的怪兽所害！奥特曼家族弃我！奥特之父逐我！甚至断我伽马射线！重生一世，今天肯德基疯狂星期四！谁请我吃？",
    "蛮讽刺的，从凌晨开始等到现在，没有一个人和我说生日快乐，我的亲人没有说，朋友也没有说，我最在乎的人也没有说，直到现在我才明白原来今天不是我生日。但是今天是肯德基疯狂星期四！谁请我吃？",
    "我独自一人远离家乡来到成都上学，同学欺我，老师骂我，舍友打我，我流浪在晨风街头，衣衫褴褛，身无分文，活得不如一条流浪狗。天地浩大，却没有我的容身之处。我想问一问苍天，今天肯德基疯狂星期四，谁请我吃?",
    "老师问三个学生，你们用什么东西可以填满一整个房间。第一个学生找来稻草铺满地板，老师摇了摇头。第二个学生找来一根蜡烛点燃，屋子里充满了光，老师还是摇了摇头，因为学生的影子没有被照到。这时第三个学生拿出肯德基疯狂星期四的黄金小酥肉，顿时香味充满了整个房间",
    "肯德基这逼养的，怎么又到了周四，我开始留头发，减重，换风格，开始往前冲，不好意思阿，这一次，肯德基疯狂星期四，我一定要吃。我本是显赫世家的少爷，却被诡计多端的奸人所害!家人弃我!师门逐我!甚至断我灵脉!重生一世，今天肯德基疯狂星期四!谁请我吃?Bro别他妈垂头丧气了知道今天是什么日子吗?今天是肯德基fucking crazy Thursday!吮指原味鸡30块钱4个Bro v我60，我他妈要吃8个。",
    "我想问一下大家，之前朋友找我借钱，前后加起来有大概七万（够立案）但是没有借条也没有字据，微信也早已互删没有任何关于借的字眼，只有支付宝上还有转账记录，我妈刚让我把转账记录发给他看一下的时候，我点支付宝点歪了，不小心点开了肯德基，发现今天是疯狂星期四，谁请我吃？",
    "我在兰州拉面馆愤怒的甩开了筷子\n-老板，怎么一点肉没有  \n-穷逼事儿还挺多，十几块你能吃到什么肉？\n被羞辱的我，痛苦，落泪，难受，突然 我看到了一个广告：19.9，疯狂星期四，20个鸡块，兰州拉面一周的肉量！谁！谁请我吃！",
    "被群成员冷暴力半年，最近没有怎么哭了，慢慢变好了……以前有多快乐，现在就有多难过。从人间烟火的日常，到红着眼睛告别，消失在彼此的世界里，很痛，也很难。今天是肯德基疯狂星期四，v我60，抚慰我支离破碎的心",
    "最讨厌网络乞丐了，想吃星期四疯狂肯德基的不会自己买吗，什么都伸手要，觉得我说的对的请给我点一份。",
    "你跟你女朋友开房，裤子一脱你女朋友花容失色的质问你:你不是说你有18cm吗?怎么这么小? 你说:因为今天是肯德基疯狂星期四活动满18减15。",
    "前段时间为了提升自己的文化素养，我给自己报了个书法培训班。因为跟我同期的都是小学生所以大家就有点排挤我，看不上我这么大年纪还在学这个。本来也没什么，但小学生的恶意真的超乎我的想象，他们说我老女人半只脚进棺材还来学书法，我听到都气哭了。我擦干眼眼泪不管他们继续练字，我发誓我一定要练出一笔好字，不能让钱白花。我凝神静气，在纸上认真写出了一行字：今天肯德基疯狂星期四，谁请我吃？",
    "我有时候会觉得大家并不喜欢那个真正的我。在网络上，我总是善于伪装，看起来每天都很快乐，无忧无虑，没有烦恼。我的生活也看起来很简单，没有很多人向往的灯红酒绿，纸醉金迷。我很宅，喜欢打游戏，现实中的我并不像网上这么有趣。我其实话很少，最爱干的事是一个人发呆。这样枯燥的我，真的会被大家喜欢吗？我很疑惑。\n如果你们能一层一层剥开我的内心，你们会发现，那颗心里写满了一句话：今天肯德基疯狂星期四，谁请我吃?",
    "生了孩子以后一直瘦不下去 老公像变了一个人似的 对我又打又骂 我好恨他 正当我打开手机想报警的时候 不小心打开了肯德基 想起来今天原来是疯狂星期四 所以说谁请我肯德基？吃完我继续讲",
    "他本是豪门少爷\n在新婚前夜却发现未婚妻和兄弟在喜床上翻滚\n她深夜买醉却撞上醉酒的他\n一夜痴缠他醒来后不见她的踪影\n只见床头压着一张纸：\n今 天 肯 德 基 疯 狂 星 期 四",
    "家人们，求助\n12月求姻缘应该去哪个寺庙？\nA、灵隐寺\nB、弘法寺\nC、甘露寺\nD、肯德基疯狂星期寺 ",
    "某个人不回消息永远别回了，终究是我不重要了吗？难道你心里就不明白吗？不然我整天闲得来找你聊天，我不会找别人聊天吗？你以为我天天闲得慌吗？我如此的喜欢你，你却对我无动于衷，这甜甜的恋爱，你到底打不打算要了？如果你还在意我，今天肯德基疯狂星期四，如果请我吃，我就原谅你",
    "时间让我长了年岁，却没有让我成为一个合格的大人。我以为我的十八岁，会工作稳定，收入可观，和喜欢的人去看山河大海，落日余晖。没想到，到了谈婚论嫁的年龄，我却仍在找自己的路上。今天肯德基疯狂星期四，谁请我吃？",
    "消息回得慢大家请理解，今天疯狂星期四，我在炸吮指原味鸡！",
    "我本是上市公司的老总，却被诡计多端的奸人所害！下属弃我！股东逐我！甚至清空我的股份！重来一生，我只想夺回我的公司！今天肯德基疯狂星期四，谁请我吃？",
    "后来不是报警了吗 那个男的隔了一个星期才找到 把他的父母和我朋友的父母喊到警察局里商量这件事到底怎么办 要不就结婚把这个孩子生下来 要么就打掉并赔偿我朋友30w 男方不想要这个孩子但是父母手头也没有这多钱 硬着头皮跟我朋友结婚了 彩礼才拿了八万 结婚后男的经常不归家在外面玩 我朋友挺着大肚子在家真的不容易 然后我实在看不下去了 就去照顾我朋友 我准备拿起手机给他打电话 又不小心点开肯德基 才想起来今天是肯德基Fucking Crazy Thursday 疯狂星期四 谁请我吃我继续说",
    "男朋友跟我分手了，我心碎了决定见她一面把事情说清楚如果她非要分手我也无话可说。到了她家门口，死活不出来。我只是一片凋零的落叶，随着风飘落，我时常在想我的凋零是我自己的选择，还是风不挽留，就像茫茫大海里的一条孤单的鱼没有人会关心我，没有人会想念我。如果有一天我被人类发现，也许是我的生命走到了尽头，人类是贪婪的，是有欲望的，鱼在他们眼里是无尽的财富海洋资源在他们眼里是赖以生存的摇钱树，有人捕鱼，有人抓蚌壳，蚌壳那么不容易，她用自己的血肉磨出了珍珠，一颗又一颗，说到珍珠，你愿不愿意转我十块钱买一杯珍珠奶茶给我这条小鱼，哎看来我是一条无人疼爱的小鱼，不过是一条无人关心无人疼爱无人喜欢无人给我买奶茶的可怜巴巴的小鱼。我心如死灰在大街上游荡，打开手机看到了我们的恩爱时光泪流满面，忽然注意到手机上显示的时间 才发现今天是肯德基疯狂星期四 谁请我吃？",
    "我本是夜上海的一名贫穷又自强的黄包车夫，看遍了这个城市的繁华和热闹，也体验了这个社会的冷漠与无情。直到那一天，我的车上坐上了一位穿着四季歌的千金小姐，我感到了我平静已久的内心再一次颤动，我知道不应该，但我却还是爱上了。我知道我的身份地位配不上她，只求有个好心人给我39.9，让我买一个疯狂星期四热辣鸡桶，带给她舔狗的关怀。",
    "今天，是我人生中最黑暗，最emo的时候，但是我很难把朋友当成垃圾桶或者树洞去倾诉，更喜欢憋着自己消化，睡一觉第二天醒来就好了，不想连累别人不想把负面情绪传递给身边的朋友。但是，我更希望朋友能够给予我物质层面的帮助，今天是肯德基疯狂星期四，有哪个朋友愿意请我吃肯德基吗？",
    "你不用故作冷淡，我没有想过继续纠缠你了，最后一次了，真的，最后一次了，借我10元子,今天是肯德基疯狂星期四吮指原味鸡+黄金脆皮鸡才九块九,我是真的不想错过。",
    "扒个群里的渣女，我有个朋友被群友睡了，大概是三个月以前吧，我朋友在群里认识了一个女的，他们在网上聊了差不多两个星期左右就见面了,而且第一次见面就去宾馆了 ，之后的每个星期六星期天都会去，就这样持续了好几个月，我朋友给那个女的说，已经一个多月没奖励自己了，想不到这句话说完，隔天就找不到那个女的了，手机一直打不通，关机，直到我朋友前几天跟她父母坦白这件事情，我朋友就在旁边一直哭，那天晚上我偷偷给他买了个石原里美同款，还是没奖励自己了，然后我第二天请假一天,专门给他聊这个事，他说那个女的对他很好很好什么的，我说对你好还不是想玩你，实在不行抱树吧，他当时听完这句话就趴桌子上大哭，正当我打开手机想抱树的时候，不小心打开了肯德基，想起来今天原来是肯德基疯狂星期四，所以说谁请我肯德基？吃完我继续说",
    "吃完后，她下决心去打掉这个负心汉的孩子，到医院检查后发现并没有怀孕，此刻的她不知是喜是悲；出了医院门口，她心里五味杂陈，决定再打最后一次电话就放过自己，电话竟然接通了，接电话的是个陌生男声，说机主癌症晚期已经去世，整理遗物时发现了没电的手机和一张合照，手机刚刚开机就接到了电话，她接电话的手都颤抖了，这个消息犹如晴天霹雳，久久不能平复；她见到了心心念念的他，安静的躺在床上，枕边是两人的合照，照片背面写着“此生最爱的*”此刻的她再也忍不住，大哭起来，对于她来说，这个星期四是黑暗星期四，痛失所爱，唯一能让她心情舒缓些的就是肯德基的疯狂星期四，v60我，她吃完肯德基继续说",
    "和你分手7年了，你还是那个能影响我情绪的人，我还留着我们的合影，还记得你的生日，我有过无数次想去找你的冲动，可还是忍住了，这条消息我不屏蔽你，因为我是你永远的黑名单，可是我爱你，从过去到现在，整整爱了你八年，但是，现在我一点也不难过，因为我压根不知道这是谁写的，也不知道这女孩是谁，我只是想顺便告诉你：今天疯狂星期四，我想吃肯德基",
    "男朋友跟我分手了，我心碎了，决定见他一面把事情说清楚，如果他非要分手我也无话可说。我买了去上海的机票，坐了两个小时的飞机，到了之后却因为疫情被封小区了他出不来。我心如死灰在大街上游荡，打开手机看到了我们的恩爱时光泪流满面，忽然注意到手机上显示的时间：今天肯德基疯狂星期四，谁请我吃？",
    "感觉你们好有趣啊，不像我,不仅连句话都搭不上，还要被当成破坏氛围的傻狗,我现实生活中自闭没朋友，哪怕是在网上也受尽冷眼，每次组织了半天的语言都如鲠在喉，最后还是默默删掉了看你们互动，你有说有笑的样子不知道为什么在我眼里这么刺眼，融入不了群体的我，躲在屏幕后面默默哭出来了，所以今天是肯德基疯狂星期四有好心人请我吃吗",
    "劝大家别买iPhone13，这样省下好几千，能吃好多顿肯德基，你用苹果只会让人酸让人骂，吃肯德基只会让人羡慕。好了，明天肯德基疯狂星期四，谁请我吃",
    "有人问我为什么不处王者荣耀cp，我哪敢处CP呀，姐姐动不动就想喝奶茶，天天还想吃外卖，一到半夜就开始回忆前任。出一个皮肤就喜欢一个，天天还要让我等她和其它哥哥弟弟们打完排位，打的菜不说还有逼脸把气撒在我身上。处CP的门槛太高了，不但要声音好听，还要长得好看，睡觉还要连麦亲亲才肯睡，我长这么大就没受过这罪。所以今天是肯德基疯狂星期四，能请我吃安慰下我吗？",
    "你好，我是空条徐伦，我被诬陷进了绿海豚街监狱，我爸又被臭打碟的打成植物人，最近一战我虽然拿回了无敌的白金之星，但也身受重伤!听说今天肯德基疯狂星期四，我现在需要有人给我带 29.9块钱4个的吮指原味鸡补充能量。恢复后我让spw财团给你打一笔财富。"
  ]
}
export class CommandCrazyThursday {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      Messages.sendMessage(session, Maths.getRandomElement(list.post));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
