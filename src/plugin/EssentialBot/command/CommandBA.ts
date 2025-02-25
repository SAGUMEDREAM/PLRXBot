import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";

export class CommandBA {
  public root = new CommandProvider()
    .addRequiredArgument('文本', 'startText')
    .addRequiredArgument('文本', 'endText')
    .onExecute(async (session, args) => {
      const startText = args.get('startText');
      const endText = args.get('endText');
      await Messages.sendMessageToReply(session, h.image(`https://oiapi.net/API/BlueArchive?startText=${encodeURIComponent(startText)}&endText=${encodeURIComponent(endText)}`));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
