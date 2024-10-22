import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {CommandProvider} from "../../../core/command/CommandProvider";

export class CommandSign {
  public readonly root = new CommandProvider()
    .onExecute((session, args) => {
      const user = UserManager.get(session);
      if(user) {
        const nowDate = new Date();
        const dataDate = new Date(user.profile.data["sign_system"]["timestamp"]);

        if (
          nowDate.getFullYear() > dataDate.getFullYear() ||
          nowDate.getMonth() > dataDate.getMonth() ||
          nowDate.getDate() > dataDate.getDate()
        ) {
          user.profile.data["sign_system"]["timestamp"] = nowDate.getTime();
          user.save();
          Messages.sendMessageToReply(session, "签到成功");
        } else {
          Messages.sendMessageToReply(session, "你已经签到过了哦");
        }
      }
    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
