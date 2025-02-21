import {CommandProvider} from "../../../core/command/CommandProvider";
import {h} from "koishi";
import {Messages} from "../../../core/network/Messages";
import {ImageUtils} from "../image/ImageUtils";
import path from "path";
import {Utils} from "../../../core/utils/Utils";

export class CommandMaiFriend {
  private imagePath = path.join(Utils.getRoot(), 'assets', 'maimai', 'join.png');
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      await session.sendQueued(h('quote', {id: session.messageId}) + "请发送待处理的图片。");

      const next = await session.prompt(30000);
      if (!next) {
        return Messages.sendMessageToReply(session, "输入超时。");
      }

      const nextElements = h.parse(next);
      const imageElements = nextElements.filter(e => e.type === 'img');

      if (imageElements.length === 0) {
        return Messages.sendMessageToReply(session, "未检测到图片，请重新发送。");
      }

      const imageUrl = imageElements[0].attrs.src;
      try {
        const result = await ImageUtils.generateAvatar(this.imagePath, imageUrl);
        Messages.sendMessageToReply(session, result);
      } catch (err) {
        Messages.sendMessageToReply(session, '图片合成失败');
      }
    })

  public static get(): CommandProvider {
    return new this().root;
  }
}

