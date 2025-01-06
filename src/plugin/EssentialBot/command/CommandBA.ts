import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import path from "path";

export class CommandBA {
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

    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
