import {CommandProvider} from "../../../core/command/CommandProvider";
import {h} from "koishi";
import {Messages} from "../../../core/network/Messages";
import {MIMEUtils} from "../../../core/utils/MIMEUtils";
import axios from "axios";
import {ImageUtils} from "../image/ImageUtils";

export class CommandIMSoHappy {
  public root = new CommandProvider()
    .addArg("true|false")
    .onExecute(async (session, args) => {
      let direction = args.get(0);
      if(direction == "true") {
        direction = true;
      } else if(direction == "false") {
        direction = false;
      } else {
        direction = true;
      }

      await session.sendQueued(h('quote', { id: session.messageId }) + "请发送待处理的图片。");

      const next = await session.prompt(30000);
      if (!next) {
        return Messages.sendMessageToReply(session, "输入超时。");
      }

      const nextElements = h.parse(next);
      const imageElements = nextElements.filter(e => e.type === 'img');

      if (imageElements.length === 0) {
        return Messages.sendMessageToReply(session, "未检测到图片，请重新发送。");
      }

      const imageList = imageElements.map(img => ({
        file: img.attrs.file,
        src: img.attrs.src
      }));

      const buffers = await Promise.all(imageList.map(async img => {
        const response = await axios.get(img.src, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
      }));

      const processedBuffer = await ImageUtils.imsoHappy(buffers[0], direction);
      Messages.sendMessageToReply(session, h.image(processedBuffer, MIMEUtils.getType(processedBuffer)))
    })

  public static get(): CommandProvider {
    return new this().root;
  }
}

