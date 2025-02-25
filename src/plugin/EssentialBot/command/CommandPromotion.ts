import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import {MessageForwarding} from "../../MessageForwarding";
import {PromptProxy} from "../../../core/utils/PromptProxy";

export class CommandPromotion {
  public root: CommandProvider = new CommandProvider()
    .addOptionalArgument("图片", "pic", null)
    .onExecute(async (session, args) => {
      await session.sendQueued(Messages.at(session.userId) + " 请输入宣发内容，输入.cancel取消");
      const next = await PromptProxy.prompt(session, args.get("pic"), 30000);
      if (!next || next == ".cancel") {
        await session.sendQueued("已取消发送");
        return;
      }
      const hArray = h.parse(next);
      MessageForwarding.INSTANCE.config.getConfig().caches.push(next);
      MessageForwarding.INSTANCE.config.save();
      await Messages.sendMessageToGroup(session, MessageForwarding.INSTANCE.config.getConfig().target_group_id, hArray);
      await session.sendQueued("发送成功");
    }).platform("onebot");

  public static get(): CommandProvider {
    return new this().root;
  }
}
