import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {Networks} from "../../../core/network/Networks";
import {UserInfo} from "../../../core/user/UserInfo";
import {UserManager} from "../../../core/user/UserManager";

export class CommandAgreeFriend {
  public root = new CommandProvider()
    .addRequiredArgument('会话ID', 'session_id')
    .requires(async (session) => await session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      let id = args.get("session_id");
      let result = ``;

      try {
        await session.bot.handleFriendRequest(id, true);
        result += `同意成功`;
      } catch (err) {
        result += `同意请求时出现了错误`;
      } finally {
        await Messages.sendMessageToReply(session, result);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
