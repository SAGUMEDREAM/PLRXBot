import {CommandProvider} from "../../../core/command/CommandProvider";
import {UserManager} from "../../../core/user/UserManager";
import {Messages} from "../../../core/network/Messages";
import {Filters} from "../../../core/utils/Filters";
import {EcoSystem} from "../eco/Eco";

export class CommandInfo {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      const userProfile = UserManager.get(session);
      const eco = EcoSystem.getSystem(userProfile);
      const mdList = [
        '## 用户信息\n',
        `* 用户名: ${Filters.isLegal(session.event.user.name) ? session.event.user.name : userProfile.profile.user_id}\n`,
        `* 用户ID: ${userProfile.profile.user_id}\n`,
        `* 用户等级: ${userProfile.profile.permission_level}\n`,
        `* 余额: ${eco.ecoObj.balance}\n`,
      ]
      const result = await Messages.getMarkdown(mdList);
      Messages.sendMessageToReply(session, result);
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
