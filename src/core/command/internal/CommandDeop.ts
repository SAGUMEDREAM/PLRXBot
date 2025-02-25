import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import {Messages} from "../../network/Messages";

export class CommandDeop {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .addRequiredArgument("用户", "user")
    .onExecute(async (session, args) => {
      const userId = args.getUserId("user");
      const user = await UserManager.getOrCreate(userId);
      if (user) {
        user.profile.permission_level = Number(1);
        await user.save();
        await Messages.sendMessageToReply(session, `已将 ${userId} 的用户权限等级设置为 ${1}`)
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    })

  public static get(): CommandProvider {
    return new this().root;
  }
}
