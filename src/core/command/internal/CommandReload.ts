import {CommandProvider} from "../CommandProvider";
import {Start} from "../../Start";
import {Messages} from "../../network/Messages";
import {LOGGER} from "../../../index";

export class CommandReload {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      try {
        await Messages.sendMessageToReply(session, "蓬莱人形Bot 重载中...");
        await Start.closingAndReloading(true);
        await Messages.sendMessageToReply(session, "蓬莱人形Bot 重载完成");
      } catch (err) {
        LOGGER.error(err);
      }
    })

  public static get(): CommandProvider{
    return new this().root;
  }
}
