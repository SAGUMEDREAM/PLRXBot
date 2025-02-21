import {CommandProvider} from "../../../core/command/CommandProvider";
import {GroupManager} from "../../../core/group/GroupManager";
import {Messages} from "../../../core/network/Messages";

export class CommandDeMute {
  public root: CommandProvider = new CommandProvider()
    .addRequiredArgument("用户", 'user')
    .onExecute(async (session, args) => {
      const target = args.getUserId("user");
      const group = GroupManager.get(session);
      if (group) {
        let hasPerm = session.hasPermissionLevel(3);
        let isAdmin = await group.isGroupAdmin(session.event.user.id);
        let botIsAdmin = await group.isGroupAdmin(session.bot.user.id)
        if ((hasPerm || isAdmin) && botIsAdmin) {
          await group.mute(target, 0);
          Messages.sendMessage(session, `用户${Messages.at(target)}被解除禁言`);
        } else {
          if ((hasPerm || isAdmin)) {
            Messages.sendMessageToReply(session, "解除禁言失败");
          } else {
            Messages.sendMessageToReply(session, "你没有使用该命令的权限");
          }
        }
      }
    })

  public static get(): CommandProvider {
    return new this().root;
  }
}
