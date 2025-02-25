import {UserManager} from "../user/UserManager";
import {Events} from "../event/Events";
import {CommandManager} from "../command/CommandManager";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {GroupManager} from "../group/GroupManager";
import {PluginEvent} from "../plugins/PluginEvent";
import {ListenerArgs, PluginListener} from "../plugins/PluginListener";

export class MessageCHandler {
  public static async handle(session: Session<User.Field, Channel.Field, Context>): Promise<void> {
    const user = await UserManager.get(session);
    const group = await GroupManager.get(session);
    if(user) {
      if(user.getProfile().banned) {
        return;
      }
      if(group != null) {
        if(group.groupData.banned) return;
      }

      const data = user.getProfileData();

      let listenerContext = await PluginListener.emit(PluginEvent.HANDLE_MESSAGE, session, ListenerArgs.create().append("user", this));
      if(listenerContext.isCancel()) {
        return;
      }
      if(data["next_message"]["open"] == true) {
        data["next_message"]["open"] = false;
        data["next_message"]["message"] = session.content;
        Events.callEvent("next_message", session);
      } else {
        await CommandManager.getInstance().parseCommand(session);
      }
    }
  }
}
