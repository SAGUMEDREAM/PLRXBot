import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";

export class CommandB50 {
  private root = new CommandProvider()
    .addOptionalArgument("用户", "user", null)
    .onExecute(async (session, args) => {
      let user: string = args.getUserId("user");
      if(user == null) {
        user = session.userId;
      }
      await Messages.sendMessageToReply(session, "正在获取中, 请稍后...");
      try {
        await Messages.sendMessageToReply(session, Messages.image(`http://localhost:8099/b50?qq=${encodeURIComponent(user)}`));
      } catch (e) {
        await Messages.sendMessageToReply(session, "获取失败");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
