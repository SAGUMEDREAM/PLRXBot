import {UserManager} from "../../../core/user/UserManager";
import {CommandProvider} from "../../../core/command/CommandProvider";
import {EcoSystem} from "../eco/Eco";
import {Messages} from "../../../core/network/Messages";

export class CommandSign {
  public readonly root = new CommandProvider()
    .onExecute((session, args) => {
      const user = UserManager.get(session);
      if (user) {
        const nowDate = new Date();
        const dataDate = new Date(user.profile.data["sign_system"]["timestamp"]);

        if (
          nowDate.getFullYear() > dataDate.getFullYear() ||
          nowDate.getMonth() > dataDate.getMonth() ||
          nowDate.getDate() > dataDate.getDate()
        ) {
          user.profile.data["sign_system"]["timestamp"] = nowDate.getTime();
          let eco = EcoSystem.getSystem(user);

          let randomBalance = Math.floor(Math.random() * (300 - 200 + 1)) + 200;

          let criticalRate = Math.random() * (1.9 - 0.9) + 0.9;
          criticalRate = parseFloat(criticalRate.toFixed(2));

          let finalBalance = Math.floor(randomBalance * criticalRate);
          eco.ecoObj.balance += finalBalance;

          user.save();

          let result = `${Messages.at(Number(String(user.profile.user_id)))} `;
          result += `签到成功！🎉\n`;
          result += `基础奖励：${randomBalance} 円\n`;
          result += `暴击倍率：×${criticalRate}\n`;
          result += `最终奖励：${finalBalance} 円\n`;
          result += `当前余额：${eco.ecoObj.balance} 円。\n`;

          Messages.sendMessageToReply(session, result);
        } else {
          Messages.sendMessageToReply(session, "你今天已经签到过了哦，别忘了明天再来！");
        }
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
