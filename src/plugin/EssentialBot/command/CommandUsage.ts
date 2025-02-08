import {CommandProvider} from "../../../core/command/CommandProvider";
import {CommandHelper} from "../../../core/command/CommandHelper";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";

export class CommandUsage {
  public root = new CommandProvider()
    .addOptionalArgument("命令", "command_string")
    .onExecute(async (session, args) => {
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

      if (parsedCommand.length == 0) {
        mdList.push("❌未知命令\n")
      } else {
        parsedCommand.forEach((usage: string) => {
          mdList.push(`* ${usage}\n`);
        });
      }

      Messages.sendMessageToReply(session, await Messages.getMarkdown(mdList));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
