import {CommandProvider} from "../CommandProvider";
import {Start} from "../../Start";
import {Messages} from "../../network/Messages";
import {LOGGER} from "../../../index";

export class CommandReload {
  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      try {
        Messages.sendMessageToReply(session, "蓬莱人形Bot 重载中...");
        await Start.reload()
        Messages.sendMessageToReply(session, "蓬莱人形Bot 重载完成");
      } catch (err) {
        LOGGER.error(err);
      }
    })

  public static get(): CommandProvider{
    return new this().root;
  }
}
