import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandAbout {
  version = 20241105;
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let result = '';
      result += '关于:\n';
      result += `- 版本: ${this.version}\n`;
      result += '- 网站: https://thonly.cc\n';
      result += '- 东方Project线下活动维基群: 868256565\n';
      result += '- 中文东方社群信息聚合频道: 589711336\n';
      result += '- 开发群: 863842932\n';
      result += '- 代码: 稀神灵梦';

      Messages.sendMessageToReply(session,result);
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
