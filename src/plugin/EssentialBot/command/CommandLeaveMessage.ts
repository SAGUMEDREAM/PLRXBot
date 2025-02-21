import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandLeaveMessage {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      Messages.sendMessageToReply(session, "请输入留言内容");
      let text = await session.prompt(30000);
      if (text == null) {
        Messages.sendMessageToReply(session, "无输入内容会话取消");
        return;
      }
      if (text == ".cancel") {
        Messages.sendMessageToReply(session, "会话取消");
        return;
      }
      Messages.sendMessageToGroup(session, 863842932, `来自${Messages.at(session.userId)}的留言\n`);
      Messages.sendMessageToGroup(session, 863842932, text);
      Messages.sendMessageToReply(session, "留言发送成功!")
    })
  ;

  public static get(): CommandProvider {
    return new this().root;
  }
}
