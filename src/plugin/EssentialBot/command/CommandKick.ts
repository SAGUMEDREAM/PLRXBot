import {CommandProvider} from "../../../core/command/CommandProvider";
import {GroupManager} from "../../../core/group/GroupManager";
import {Messages} from "../../../core/network/Messages";
import {botInstance} from "../../../index";

export class CommandKick {
  public root: CommandProvider = new CommandProvider()
    .addRequiredArgument("用户", "user")
    .addOptionalArgument("群号", "group_id")
    .addOptionalArgument("是否永久", "permanent", false)
    .onExecute(async (session, args) => {
      let target = args.get("user");
      let target_group_id = args.get("group_id");
      let permanent = args.get("permanent");

      const group = GroupManager.get(target_group_id || session);
      if (group) {
        let hasPerm = session.hasPermission(3);
        let isAdmin = await group.isGroupAdmin(session.event.user.id);
        let botIsAdmin = await group.isGroupAdmin(session.bot.user.id)
        if ((hasPerm || isAdmin) && botIsAdmin) {
          if (target_group_id != null) {
            await botInstance.kickGuildMember(target_group_id, target, permanent);
          } else {
            await group.kick(target, permanent);
          }
          Messages.sendMessageToReply(session, "成功踢出用户" + Messages.at(target));
        } else {
          if ((hasPerm || isAdmin)) {
            Messages.sendMessageToReply(session, "踢出失败");
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
