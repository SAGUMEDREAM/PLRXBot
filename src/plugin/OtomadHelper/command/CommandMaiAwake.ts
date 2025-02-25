import {CommandProvider} from "../../../core/command/CommandProvider";
import {h} from "koishi";
import {Messages} from "../../../core/network/Messages";
import {ImageUtils} from "../image/ImageUtils";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import {PromptProxy} from "../../../core/utils/PromptProxy";

export class CommandMaiAwake {
  private imagePath = path.join(Utils.getRoot(), 'assets', 'maimai', 'awake.png');
  public root = new CommandProvider()
    .addOptionalArgument("图片", "pic", null)
    .onExecute(async (session, args) => {
      await session.sendQueued(h('quote', {id: session.messageId}) + "请发送待处理的图片。");

      const next = await PromptProxy.prompt(session, args.get("pic"), 30000);
      if (!next) {
        return await Messages.sendMessageToReply(session, "输入超时。");
      }

      const nextElements = h.parse(next);
      const imageElements = nextElements.filter(e => e.type === 'img');

      if (imageElements.length === 0) {
        return await Messages.sendMessageToReply(session, "未检测到图片，请重新发送。");
      }

      const imageUrl = imageElements[0].attrs.src;
      try {
        const result = await ImageUtils.generateAvatar(this.imagePath, imageUrl);
        await Messages.sendMessageToReply(session, result);
      } catch (err) {
        await Messages.sendMessageToReply(session, '图片合成失败');
      }
    })

  public static get(): CommandProvider {
    return new this().root;
  }
}

