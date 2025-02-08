import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";

export class CommandB50 {
  private root = new CommandProvider()
    .onExecute((session, args) => {
      Messages.sendMessageToReply(session, "正在获取中, 请稍后...");
      try {
        Messages.sendMessageToReply(session, Messages.image(`http://localhost:8099/b50?qq=${encodeURIComponent(session.userId)}`));
      } catch (e) {
        Messages.sendMessageToReply(session, "获取失败");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
