import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {CommandProvider} from "../../../core/command/CommandProvider";

export class CommandLike {
  public readonly root = new CommandProvider()
    .disabledCommand()
    .onExecute(async (session, args) => {
      const user = await UserManager.get(session);
      if(user) {
        try {
          for (let i = 0; i<20 ; ++i) {
            await session.bot.internal.sendLike(session.userId, 1);
          }
          await Messages.sendMessageToReply(session, "操作完成");
        } catch (err) {
          await Messages.sendMessageToReply(session, "操作失败");
        }
      }
    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
