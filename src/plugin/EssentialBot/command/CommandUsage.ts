import {CommandProvider} from "../../../core/command/CommandProvider";
import {CommandHelper} from "../../../core/command/CommandHelper";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";

export class CommandUsage {
  public root = new CommandProvider()
    .addArg("命令")
    .onExecute((session, args) => {
      // if(session.bot.user.id == session.event.user.id) return;
      let command = args.mergeWithSpace();
      if (args.mergeWithSpace() == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      if (!command.startsWith('/') && !command.startsWith('$')) {
        command = '/' + command;
      }
      let mdList = [];
      mdList.push(`## ${command} 使用方法\n`);
      let parsedCommand = CommandHelper.parseCommandTreeToArray(command);

      if(parsedCommand.length == 0) {
        mdList.push("* ❌ 未知命令\n")
      } else {
        parsedCommand.forEach((usage: string) => {
          mdList.push(`* ${usage}\n`);
        });
      }

      Messages.sendMessageToReply(session, h.image(Messages.generateMarkdown(mdList), 'image/png'));
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
