import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MessageMerging} from "../../../core/network/MessageMerging";

export class CommandCommandHelper {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let result = MessageMerging.create(session);
      let text = '';
      text += '帮助菜单:\n';
      text += `获取命令用法: /用法 [命令]\n`;
      text += `搜索东方活动: /搜索活动 [活动名称]\n`;
      text += `莉莉云搜索: /莉莉云 [内容]\n`;
      text += `搜索群组: /搜索群组 [关键词]\n`;
      text += `今日人品: /今日人品\n`;
      text += `参拜神社: /参拜神社\n`;
      text += `查询信仰: /查询信仰\n`;
      text += `电棍活字印刷: /活字印刷 [内容]\n`;
      text += `音MAD助手: /音MAD助手\n`;
      text += `Maimai查询: /b50\n`;
      text += `说怪话: /说怪话 [关键词]\n`;
      text += `留言: /留言 [内容]\n`;
      text += `关于: /关于`;
      result.put(text);
      Messages.sendMessage(session, result.get());
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
