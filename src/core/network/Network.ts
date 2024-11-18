import request from "sync-request";
import {UserManager} from "../user/UserManager";
import {Events} from "../event/Events";
import {CommandManager} from "../command/CommandManager";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {GroupManager} from "../group/GroupManager";
import {PluginEvent} from "../plugins/PluginEvent";
import {PluginListener} from "../plugins/PluginListener";

export class Network {
  public static handle(session: Session<User.Field, Channel.Field, Context>): void {
    const user = UserManager.get(session);
    const group = GroupManager.get(session);
    if(user) {
      if(user.getProfile().banned) {
        return;
      }
      if(group != null) {
        if(group.groupData.banned) return;
      }

      try {PluginListener.emit(PluginEvent.HANDLE_MESSAGE, session);} catch (i) {return;}

      const data = user.getProfileData();
      session.hasPermission = ((permission: any) => UserManager.hasPermission(session, permission));
      session.hasPermissionLevel = ((permissionLevel: any) => UserManager.hasPermissionLevel(session, permissionLevel));
      session.hasGroupPermission = ((permission: any) => GroupManager.hasPermission(session, permission));

      if(data["next_message"]["open"] == true) {
        data["next_message"]["open"] = false;
        data["next_message"]["message"] = session.content;
        Events.callEvent("next_message", session);
      } else {
        CommandManager.getInstance().parseCommand(session);
      }
    }
  }
  public static getJson(_url: string): any {
    try {
      const res = request('GET', _url, { headers: { 'Content-Type': 'application/json' } });
      return JSON.parse(res.getBody('utf8'));
    } catch (error) {
      console.error('Error during request:', error);
      return null;
    }
  }
}
