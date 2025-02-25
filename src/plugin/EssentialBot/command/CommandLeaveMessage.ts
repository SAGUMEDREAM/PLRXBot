import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {PromptProxy} from "../../../core/utils/PromptProxy";

export class CommandLeaveMessage {
  public root = new CommandProvider()
    .addOptionalArgument("图片", "pic", null)
    .onExecute(async (session, args) => {
      await Messages.sendMessageToReply(session, "请输入留言内容");
      let text = await PromptProxy.prompt(session, args.get("pic"), 30000);
      if (text == null) {
        await Messages.sendMessageToReply(session, "无输入内容会话取消");
        return;
      }
      if (text == ".cancel") {
        await Messages.sendMessageToReply(session, "会话取消");
        return;
      }
      await Messages.sendMessageToGroup(session, 863842932, `来自${Messages.at(session.userId)}的留言\n`);
      await Messages.sendMessageToGroup(session, 863842932, text);
      await Messages.sendMessageToReply(session, "留言发送成功!")
    })
  ;

  public static get(): CommandProvider {
    return new this().root;
  }
}
