import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";

export class CommandRandomAnime {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      await Messages.sendMessageToReply(session, h.image(`https://www.hhlqilongzhu.cn/api/tu_yitu.php`));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
