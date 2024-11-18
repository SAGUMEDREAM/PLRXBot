import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {CommandProvider} from "../../../core/command/CommandProvider";
import {EcoSystem} from "../eco/Eco";

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
          let eco = EcoSystem.getSystem(user);
          let randomBalance = Math.floor(Math.random() * (300 - 200 + 1)) + 200
          eco.ecoObj.balance += randomBalance;
          user.save();
          let result = `${Messages.at(Number(String(user.profile.user_id)))} `;
          result += `签到成功！🎉\n`;
          result += `本次签到获得了 ${randomBalance} 円！\n`;
          result += `当前余额：${eco.ecoObj.balance} 円。\n`;

          Messages.sendMessageToReply(session, result);
        } else {
          Messages.sendMessageToReply(session, "你今天已经签到过了哦，别忘了明天再来！");
        }
      }
    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
