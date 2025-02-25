import {CommandProvider} from "../../../core/command/CommandProvider";
import {EssentialBot} from "../index";
import {THPlayListManager} from "../utils/THPlayListManager";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import {MIMEUtils} from "../../../core/utils/MIMEUtils";

export class CommandRandomTouhouMusic {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      const thPlayListManager: THPlayListManager = EssentialBot.INSTANCE.thPlayListManager;
      const musicObject = thPlayListManager.random();
      const buffer = await Messages.getBuffer(musicObject.path);
      if (buffer != null) {
        await Messages.sendMessageToReply(session, `名称：${musicObject.from} - ${musicObject.name}`);
        await Messages.sendMessage(session, h.audio(buffer, MIMEUtils.getType(buffer)));
      } else {
        await Messages.sendMessageToReply(session, "获取失败");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
