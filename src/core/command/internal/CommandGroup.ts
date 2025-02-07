import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";
import {GroupManager} from "../../group/GroupManager";

export class CommandGroup {
  public readonly ban = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.get(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const groupData = GroupManager.get(target);
      if (groupData) {
        groupData.groupData.banned = true;
        groupData.save();
        Messages.sendMessageToReply(session, `已封禁群聊 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "群聊不存在");
      }
    });

  public readonly pardon = new CommandProvider()
    .addArg("目标")
    .onExecute((session, args) => {
      const target = args.get(0);
      if (target == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const groupData = GroupManager.get(target);
      if (groupData) {
        groupData.groupData.banned = false;
        groupData.save();
        Messages.sendMessageToReply(session, `已解封群聊 ${target}`);
      } else {
        Messages.sendMessageToReply(session, "群聊不存在");
      }
    });

  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(4))
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("ban", this.ban)
    .addSubCommand("pardon", this.pardon)

  public static get(): CommandProvider {
    return new this().root;
  }
}
