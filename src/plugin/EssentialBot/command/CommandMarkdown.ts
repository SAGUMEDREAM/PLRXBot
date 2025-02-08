import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import request from "sync-request";
import {Options, FormData} from "sync-request";
import {h} from "koishi";

export class CommandMarkdown {
  public root = new CommandProvider()
    .addRequiredArgument("文本", "texts")
    .requires(session => session.hasPermissionLevel(3))
    .onExecute(async (session, args) => {
      const texts = args.getArgumentsString();
      const api = "http://localhost:8099/markdown";
      const data: FormData = new FormData();
      for (const text of texts) {
        data.append("texts", text);
      }

      let options: Options = {
        form: data,
      }
      let res = request("POST", api, options);
      let body: any = res.getBody();
      let buffer: Buffer = body;
      Messages.sendMessageToReply(session, h.image(buffer, 'image/png'))
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
