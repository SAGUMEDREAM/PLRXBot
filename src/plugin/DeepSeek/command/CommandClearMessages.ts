import {CommandProvider} from "../../../core/command/CommandProvider";
import {GroupManager} from "../../../core/group/GroupManager";
import {getSystemCharacter} from "./CommandChat";
import {Messages} from "../../../core/network/Messages";

export class CommandClearMessages {
  public root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .onExecute(async (session, args) => {
      const group_id = session.channelId;
      if (group_id == null) {
        await CommandProvider.leakPermission(session, args);
        return;
      }

      const group_data = await GroupManager.get(session);

      group_data.groupData.data['deep_seek_messages'] = [
        { role: "system", content: getSystemCharacter() }
      ];

      await group_data.save();
      await Messages.sendMessageToReply(session, "聊天记录已清空，Bot设定已重置。");
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
