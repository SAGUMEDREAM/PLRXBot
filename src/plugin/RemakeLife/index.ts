import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {Config} from "../../core/data/Config";
import {Random} from 'koishi'
import {CommandProvider} from "../../core/command/CommandProvider";
import {Messages} from "../../core/network/Messages";

export const regions = [
  null, '法国', '中国', '德国', '加拿大', '缅甸', '日本', '英国', '美国', '韩国', '朝鲜',
  '印度', '西班牙', '巴西', '冰岛', '挪威', '丹麦', '瑞典', '芬兰'
]

export const specialRegions = ['交界地', '幻想乡']

export const locations = ['大学', '县城', '首都', '农村', '市区']

export const specialLocations = {
  '美国': ['圣地亚哥'],
  '日本': ['穗织村', '鹫逗市', '京都市', '学园都市', '新日暮里'],
  '交界地': ['宁姆格福', '史东薇尔城', '盖利德', '黄金树', '王城罗德尔', '摩恩城', '湖之利耶尼亚', '亚坛高原'],
  '幻想乡': ['博丽神社', '妖怪之山', '雾之湖', '红魔馆']
}

export const identities = [
  '女孩子', '鼠鼠', '鲨鲨', '猫猫', '男孩子',
  '狗狗', '鸽子', '兔兔', 'xyn', '小南梁'
]

export function getSpecialIdentities(location: string) {
  // 交界地
  if (specialLocations['交界地'].includes(location)) {
    return [
      '褪色者', '「月之公主」菈妮', '「碎星」拉塔恩', '「约定之王」拉塔恩', '「恶兆妖鬼」玛尔基特', '「死眠少女」菲雅', '帕奇', '「女神」玛莉卡', '「接肢」葛瑞克',
      '「腐败女神」玛莲妮亚', '「鲜血君王」蒙格'
    ]
  } else {
    switch (location) {
      // 美国
      case '圣地亚哥':
        return ['金坷垃非洲哥', '金坷垃日本哥', '金坷垃欧洲哥'];
      // 日本
      case '穗织村':
        return [
          '朝武芳乃', '常陆茉子', '有地将臣', '丛雨', '蕾娜·列支敦瑙尔',
          '鞍马小春', '马庭芦花', '鞍马廉太郎', '鞍马玄十郎'
        ];
      case '鹫逗市':
        return [
          '三司绫濑', '在原七海', '二条院羽月', '式部茉优', '壬生千咲', '在原晓',
          '周防恭平'
        ];
      case '京都市':
        return [
          '保科柊史', '绫地宁宁', '因幡巡', '户隐憧子', '椎叶䌷', '假屋和奏'
        ];
      case '学园都市':
        return [
          '上条当麻', '茵蒂克丝', '御坂美琴', '白井黑子', '佐天泪子', '食蜂操祈', '婚后光子', '初春饰利',
          '一方通行'
        ];
      case '新日暮里':
        return [
          '木吉', '比利·海灵顿(比利王)', '范·达克霍姆(Van♂样)'
        ];
      // 幻想乡
      case '博丽神社':
        return [
          '博丽灵梦', '玄爷', '桑尼米尔克', '露娜切露德', '斯塔萨菲雅',
          '克劳恩皮丝', '高丽野阿吽'
        ];
      case '妖怪之山':
        return [
          '橙', '秋静叶', '秋穰子', '键山雏', '东风谷早苗', '八坂神奈子',
          '洩矢诹访子', '豪德寺三花', '犬走椛', '射命丸文', '姬海棠果',
          '饭纲丸龙', '伊吹萃香', '星熊勇仪'
        ];
      case '雾之湖':
        return ['若鹭姬', '琪露诺'];
      case '红魔馆':
        return [
          '蕾米莉亚·斯卡蕾特', '芙兰朵露·斯卡蕾特', '十六夜咲夜', '帕秋莉·诺蕾姬',
          '红美铃'
        ];
      default:
        return identities;
    }
  }
}

export class RemakeLife extends PluginInitialization {
  public static INSTANCE: PluginInitialization;
  constructor() {
    super("remake_life");
    RemakeLife.INSTANCE = this;
  }

  public load(): void {
    const instance = this.commandManager;
    instance.registerCommand(["remake", "重开"],
      new CommandProvider()
        .onExecute(async (session, args) => {
          const region = Random.pick([...regions, ...specialRegions]);
          if (region) {
            let location: string;
            if(specialLocations[region]) {
              location = Random.pick([
                ...specialLocations[region],
                ...locations
              ])
            } else {
              location = Random.pick(locations)
            }
            const identity = Random.pick(getSpecialIdentities(location));
            await Messages.sendMessageToReply(session, `重开成功！你出生在${region}的${location}，是${identity}！`);
          } else {
            await Messages.sendMessageToReply(session, `重开失败！你没能出生！`);
          }
        })
    );
  }
}
