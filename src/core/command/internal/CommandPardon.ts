import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import {Messages} from "../../network/Messages";

export class CommandPardon {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(3))
    .addRequiredArgument('用户', 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");

      const user = await UserManager.getOrCreate(target);
      if (user) {
        user.profile.banned = false;
        await user.save();
        await Messages.sendMessageToReply(session, `已解封用户 ${target}`);
      } else {
        await Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
