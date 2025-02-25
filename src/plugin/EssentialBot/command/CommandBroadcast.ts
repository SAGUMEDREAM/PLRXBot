import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {contextOptional, LOGGER} from "../../../index";

export class CommandBroadcast {
  public root = new CommandProvider()
    .addRequiredArgument('消息', 'message')
    .requires(async (session) => await session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      const msg = args.getArgumentsString();
      try {
        await Messages.sendMessage(session, `正在广播中...`);
        await contextOptional.value.broadcast(msg);
        await Messages.sendMessage(session, `广播完成`);
      } catch (err) {
        await Messages.sendMessage(session, `广播失败`);
        LOGGER.error(err);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
