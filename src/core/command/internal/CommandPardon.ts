import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import {Messages} from "../../network/Messages";

export class CommandPardon {
  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(3))
    .addRequiredArgument('用户', 'user')
    .onExecute((session, args) => {
      const target = args.getUserId("user");

      const user = UserManager.getOrCreate(target);
      if (user) {
        user.profile.banned = false;
        user.save()
        Messages.sendMessageToReply(session, `已解封用户 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "用户不存在");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
