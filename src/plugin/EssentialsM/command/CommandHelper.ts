import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandCommandHelper {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let result = '';
      result += '帮助菜单:\n';
      result += `- 获取命令用法: /用法 [命令]\n`;
      result += `- 搜索东方活动: /搜索活动 [活动名称]\n`;
      result += `- 莉莉云搜索: /莉莉云 [内容]\n`;
      result += `- 电棍活字印刷: /活字印刷 [内容]\n`;
      result += `- Maimai查询: /b50\n`;
      result += `- 说怪话: /说怪话 [关键词]\n`;
      result += `- 留言: /留言 [内容]\n`;
      result += `- 关于: /关于`;
      Messages.sendMessageToReply(session,result);
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
