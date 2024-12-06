import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import {Networks} from "../../../core/network/Networks";
import {UserProfile} from "../../../core/user/UserProfile";
import {UserManager} from "../../../core/user/UserManager";

export class CommandAgreeInvite {
  public root = new CommandProvider()
    .addArg("会话ID")
    .requires(session => session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      let id = args.get(0);
      let result = ``;
      let userProfile = UserManager.get(session);
      if(id == null || id == "") {
        Messages.sendMessageToReply(session,"缺少参数");
        return;
      }
      try {
        await session.bot.handleGuildRequest(id, true);
        result += `同意成功`;
      } catch (err) {
        result += `同意请求时出现了错误`;
      } finally {
        Messages.sendMessageToReply(session, result);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
