import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import {Messages} from "../../network/Messages";

export class CommandOp {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .addRequiredArgument("用户","user")
    .addOptionalArgument("等级","level", null)
    .onExecute(async (session, args) => {
      const userId = args.getUserId("user");
      let level = args.getNumber("level");
      if(level == null) level = 3;
      const user = await UserManager.getOrCreate(userId);
      if (user) {
        user.profile.permission_level = Number(level);
        await user.save();
        await Messages.sendMessageToReply(session, `已将 ${userId} 的用户权限等级设置为 ${level}`)
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    })
  public static get(): CommandProvider {
    return new this().root;
  }
}
