import {UserManager} from "../user/UserManager";
import {Events} from "../event/Events";
import {CommandManager} from "../command/CommandManager";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {GroupManager} from "../group/GroupManager";
import {PluginEvent} from "../plugins/PluginEvent";
import {PluginListener} from "../plugins/PluginListener";

export class MessageCHandler {
  public static async handle(session: Session<User.Field, Channel.Field, Context>): Promise<void> {
    const user = UserManager.get(session);
    const group = GroupManager.get(session);
    if(user) {
      if(user.getProfile().banned) {
        return;
      }
      if(group != null) {
        if(group.groupData.banned) return;
      }

      const data = user.getProfileData();

      try {PluginListener.emit(PluginEvent.HANDLE_MESSAGE, session);} catch (i) {return;}

      if(data["next_message"]["open"] == true) {
        data["next_message"]["open"] = false;
        data["next_message"]["message"] = session.content;
        Events.callEvent("next_message", session);
      } else {
        CommandManager.getInstance().parseCommand(session);
      }
    }
  }
}
