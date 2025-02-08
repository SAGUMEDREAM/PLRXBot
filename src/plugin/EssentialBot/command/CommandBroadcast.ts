import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {ctxInstance, LOGGER} from "../../../index";

export class CommandBroadcast {
  public root = new CommandProvider()
    .addRequiredArgument('消息', 'message')
    .requires(session => session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      const msg = args.raw;
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
