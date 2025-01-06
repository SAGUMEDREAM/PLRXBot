import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import {ctxInstance, LOGGER} from "../../../index";

export class CommandBroadcast {
  public root = new CommandProvider()
    .addArg("消息")
    .requires(session => session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      let msg = args.merge();
      if(msg == null || msg == "") {
        Messages.sendMessageToReply(session,"缺少参数");
        return;
      }
      try {
        Messages.sendMessage(session, `正在广播中...`);
        await ctxInstance.broadcast(msg);
        Messages.sendMessage(session, `广播完成`);
      } catch (err) {
        Messages.sendMessage(session, `广播失败`);
        LOGGER.error(err);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
