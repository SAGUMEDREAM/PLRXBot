import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";

export class CommandRejectInvite {
  public root = new CommandProvider()
    .addRequiredArgument("会话ID", "session_id")
    .requires(session => session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      let id = args.get("session_id");
      let result = ``;
      let userProfile = UserManager.get(session);

      try {
        await session.bot.handleGuildRequest(id, false);
        result += `已拒绝`;
      } catch (err) {
        result += `拒绝请求时出现了错误`;
      } finally {
        Messages.sendMessageToReply(session, result);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
