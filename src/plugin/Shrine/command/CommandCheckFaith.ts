import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {ShrineObject, Shrines} from "../index";

export class CommandCheckFaith {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let result = "";
      let atUser = Messages.at(Number(session.userId));
      let user = UserManager.get(session);
      let shrine = Shrines.getObject(user);

      result += `${atUser} 你的当前信仰度为 ${shrine.faith} 点\n信仰等级为 ${shrine.level} 级\n已参拜 ${shrine.count} 次。`;

      Messages.sendMessageToReply(session, result);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
