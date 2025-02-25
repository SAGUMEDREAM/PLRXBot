import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandChoice {
  public root = new CommandProvider()
    .addRequiredArgument('选择的数量', 'amount')
    .addRequiredArgument('数据','data')
    .onExecute(async (session, args) => {
      const msgs = args.all();
      const count = args.get('amount');

      if (isNaN(count) || count <= 0 || count > msgs.length) {
        await Messages.sendMessageToReply(session, `请选择有效的数量（1 到 ${msgs.length} 之间）`);
        return;
      }
      let selectedMessages = msgs.slice(1, 1 + count);
      await Messages.sendMessageToReply(session, `> ${selectedMessages.join(", ")}`);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
