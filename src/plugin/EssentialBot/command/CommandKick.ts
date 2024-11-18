import {CommandProvider} from "../../../core/command/CommandProvider";
import {GroupManager} from "../../../core/group/GroupManager";
import {Messages} from "../../../core/network/Messages";
import {botInstance} from "../../../index";

export class CommandKick {
  public root: CommandProvider = new CommandProvider()
    .addArg("目标")
    .addArg("群号")
    .addArg("-P (永久)")
    .onExecute((session, args) => {
      (async () => {
        let target = args.get(0);
        let target_group = args.get(1);
        let permanent = args.includes("-P");
        if(target == null) {
          Messages.sendMessageToReply(session,"参数不完整");
          return;
        }
        const group = GroupManager.get(session);
        if(group) {
          let hasPerm = session.hasPermission(3);
          let isAdmin = await group.isGroupAdmin(session.event.user.id);
          let botIsAdmin = await group.isGroupAdmin(session.bot.user.id)
          if((hasPerm || isAdmin) && botIsAdmin) {
            if(target_group != null) {
              await botInstance.kickGuildMember(target_group, target, permanent);
            } else {
              await group.kick(target, permanent);
            }
            Messages.sendMessageToReply(session,"成功踢出用户" + Messages.at(target));
          } else {
            if((hasPerm || isAdmin)) {
              Messages.sendMessageToReply(session,"踢出失败");
            } else {
              Messages.sendMessageToReply(session,"你没有使用该命令的权限");
            }
          }
        }
      })();
    })
  public static get(): CommandProvider {
    return new this().root;
  }
}
