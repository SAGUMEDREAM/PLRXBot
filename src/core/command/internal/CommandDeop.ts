import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import {Messages} from "../../network/Messages";

export class CommandDeop {
  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(4))
    .addRequiredArgument("用户","user")
    .onExecute((session, args) => {
      const userId = args.getUserId("user");
      const user = UserManager.getOrCreate(userId);
      if (user) {
        user.profile.permission_level = Number(1);
        user.save();
        Messages.sendMessageToReply(session, `已将 ${userId} 的用户权限等级设置为 ${1}`)
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    })
  public static get(): CommandProvider {
    return new this().root;
  }
}
