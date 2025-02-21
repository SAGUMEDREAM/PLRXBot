import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import axios from "axios";
import {MIMEUtils} from "../../../core/utils/MIMEUtils";

export class Command5K {
  public root = new CommandProvider()
    .addRequiredArgument('文本', 'text1')
    .addRequiredArgument('文本', 'text2')
    .onExecute(async (session, args) => {
      const top = args.get('text1');
      const bottom = args.get('text2');

      const api = `https://gsapi.cbrx.io/image?top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&noalpha=true`;

      try {
        const res = await axios.get(api, { responseType: 'arraybuffer' });
        const buffer: Buffer = Buffer.from(res.data);
        Messages.sendMessageToReply(session, h.image(buffer, MIMEUtils.getType(buffer)));
      } catch (error) {
        Messages.sendMessageToReply(session, "生成图片失败，请稍后再试。");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
