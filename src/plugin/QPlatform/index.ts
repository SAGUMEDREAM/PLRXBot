import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {PluginListener} from "../../core/plugins/PluginListener";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {Messages} from "../../core/network/Messages";
import {CommandProvider} from "../../core/command/CommandProvider";
import {CommandTHSearchQQPlatform} from "./command/CommandTHSearchQQPlatform";
import {CommandGroupSearchQQPlatform} from "./command/CommandGroupSearchQQPlatform";


export class QPlatform extends PluginInitialization {
  public static INSTANCE: QPlatform;
  constructor() {
    super("q_platform");
    QPlatform.INSTANCE = this;
  }

  public load(): void {
    const commandManager = this.commandManager;
    commandManager.registerCommand(["生成"],
      new CommandProvider()
        .addSubCommand("ba", commandManager.getCommand("ba"))
        .addSubCommand("5k", commandManager.getCommand("5k"))
        .addSubCommand("水晶球", commandManager.getCommand("水晶球"))
        .addSubCommand("球面化", commandManager.getCommand("球面化"))
        .addSubCommand("逆球面化", commandManager.getCommand("逆球面化"))
        .addSubCommand("我巨爽", commandManager.getCommand("我巨爽"))
        .addSubCommand("旅行伙伴加入", commandManager.getCommand("旅行伙伴加入"))
        .addSubCommand("旅行伙伴觉醒", commandManager.getCommand("旅行伙伴觉醒"))
        .addSubCommand("喜报", commandManager.getCommand("喜报"))
        .addSubCommand("悲报", commandManager.getCommand("悲报"))
        .platform("qq"))
    commandManager.registerCommand(["mai"],
      new CommandProvider()
        .addSubCommand("b50", commandManager.getCommand("b50"))
        .addSubCommand("别名", commandManager.getCommand("别名"))
        .addSubCommand("随机歌曲", commandManager.getCommand("随机歌曲"))
        .addSubCommand("查歌", commandManager.getCommand("查歌"))
        .addSubCommand("搜歌", commandManager.getCommand("搜歌"))
        .addSubCommand("点歌", commandManager.getCommand("点歌"))
        .platform("qq")
    );
    commandManager.registerCommand(["随机"],
      new CommandProvider()
        .addSubCommand("东方", commandManager.getCommand("随机东方图"))
        .addSubCommand("东方原曲", commandManager.getCommand("随机东方原曲"))
        .addSubCommand("二次元", commandManager.getCommand("随机二次元"))
        .addSubCommand("数字", commandManager.getCommand("随机数字"))
        .addSubCommand("uuid", commandManager.getCommand("随机UUID"))
        .addSubCommand("选择", commandManager.getCommand("choice"))
        .addSubCommand("kfc", commandManager.getCommand("随机kfc"))
        .platform("qq")
    );
    commandManager.registerCommand(["搜索"],
      new CommandProvider()
        .addSubCommand("活动", CommandTHSearchQQPlatform.get())
        .addSubCommand("群组", CommandGroupSearchQQPlatform.get())
        .addSubCommand("thb", commandManager.getCommand("thb搜索"))
        .addSubCommand("莉莉云", commandManager.getCommand("莉莉云"))
        .addSubCommand("缩写", commandManager.getCommand("何意味"))
        .addSubCommand("百度搜图", commandManager.getCommand("百度搜图"))
        .platform("qq")
    );
  }
}
