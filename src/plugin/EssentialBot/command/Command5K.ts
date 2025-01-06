import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import request from "sync-request";
import {Options, FormData} from "sync-request";
import {h} from "koishi";

export class Command5K {
  public root = new CommandProvider()
    .addArg("文本")
    .addArg("文本")
    .onExecute(async (session, args) => {
      let top = args.get(0);
      let bottom = args.get(0);
      if (top == null || bottom == null) {
        Messages.sendMessageToReply(session, "缺少参数");
        return;
      }

      let api = `https://gsapi.cbrx.io/image?top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&noalpha=true`;

      let res = request("GET", api, {});
      let body: any = res.getBody();
      let buffer: Buffer = body;
      Messages.sendMessage(session, h.image(buffer, 'image/png'))
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
