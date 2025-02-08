import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {CommandProvider} from "../../../core/command/CommandProvider";

export class CommandLike {
  public readonly root = new CommandProvider()
    .onExecute(async (session, args) => {
      const user = UserManager.get(session);
      if(user) {
        try {
          await session.bot.internal.sendLike(session.userId, 20);
          Messages.sendMessageToReply(session, "操作完成");
        } catch (err) {
          Messages.sendMessageToReply(session, "操作失败");
        }
      }
    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
