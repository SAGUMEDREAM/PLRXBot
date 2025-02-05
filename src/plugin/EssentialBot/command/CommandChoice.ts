import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandChoice {
  public root = new CommandProvider()
    .addArg("数量")
    .addArg("文本")
    .onExecute(async (session, args) => {
      let msgs = args.all();
      let count = args.get(0) || 1;
      if (msgs == null || msgs.length < 1) {
        Messages.sendMessageToReply(session, "缺少参数");
        return;
      }
      if (isNaN(count) || count <= 0 || count > msgs.length) {
        Messages.sendMessageToReply(session, `请选择有效的数量（1 到 ${msgs.length} 之间）`);
        return;
      }
      let selectedMessages = msgs.slice(1, 1 + count);
      Messages.sendMessageToReply(session, `> ${selectedMessages.join(", ")}`);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
