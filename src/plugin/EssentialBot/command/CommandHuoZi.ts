import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import request from "sync-request";
import {Options, FormData} from "sync-request";
import {h} from "koishi";

export class CommandHuoZi {
  public root = new CommandProvider()
    .addArg("文本")
    // .requires(session => session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      let texts = args.getRaw();
      if (texts == null) {
        Messages.sendMessageToReply(session, "缺少参数");
        return;
      }

      let api = "http://localhost:8099/huozi";
      let data: FormData = new FormData();
      for (const text of texts) {
        data.append("texts", text);
      }

      let options: Options = {
        form: data,
      }
      let res = request("POST", api, options);
      let body: any = res.getBody();
      let buffer: Buffer = body;
      Messages.sendMessage(session, h.audio(buffer, "audio/wav"))
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
