import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";
import {GroupManager} from "../../group/GroupManager";

export class CommandGroup {
  public readonly ban = new CommandProvider()
    .addRequiredArgument('群号', 'group_id')
    .onExecute(async (session, args) => {
      const target = args.getUserId("group_id");
      const groupData = await GroupManager.get(target);
      if (groupData) {
        groupData.groupData.banned = true;
        await groupData.save();
        await Messages.sendMessageToReply(session, `已封禁群聊 ${target}`);
      } else {
        await Messages.sendMessageToReply(session, "群聊不存在");
      }
    });

  public readonly pardon = new CommandProvider()
    .addRequiredArgument('群号', 'group_id')
    .onExecute(async (session, args) => {
      const target = args.get("group_id");
      const groupData = await GroupManager.get(target);
      if (groupData) {
        groupData.groupData.banned = false;
        await groupData.save();
        await Messages.sendMessageToReply(session, `已解封群聊 ${target}`);
      } else {
        await Messages.sendMessageToReply(session, "群聊不存在");
      }
    });

  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("ban", this.ban)
    .addSubCommand("pardon", this.pardon)

  public static get(): CommandProvider {
    return new this().root;
  }
}
