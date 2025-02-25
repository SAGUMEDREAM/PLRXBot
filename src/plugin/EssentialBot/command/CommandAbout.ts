import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandAbout {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      let mdList = [
        `## 关于本项目\n`,
        `* 网站：https://thonly.cc\n`,
        `* 东方Project线下活动维基群：868256565\n`,
        `* 中文东方社群信息聚合频道：589711336\n`,
        `* 开发群：863842932\n`,
        `* 开发/代码：稀神灵梦\n`
      ];
      await Messages.sendMessageToReply(session, await Messages.markdown(mdList));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
