import {CommandProvider} from "../../../core/command/CommandProvider";
import {CommandHelper} from "../../../core/command/CommandHelper";
import {Messages} from "../../../core/network/Messages";

export class CommandUsage {
  public root = new CommandProvider()
    .addArg("命令")
    .onExecute((session, args) => {
      if(session.bot.user.id == session.event.user.id) return;
      let command = args.mergeWithSpace();
      if (args.mergeWithSpace() == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      if (!command.startsWith('/') && !command.startsWith('$')) {
        command = '/' + command;
      }
      let outputText = ``;
      let parsedCommand = CommandHelper.parseCommandTreeToArray(command);

      if(parsedCommand.length == 0) {
        outputText += `❌未知命令`;
      } else {
        outputText += `📜使用方法如下: \n`;
        parsedCommand.forEach((usage: string) => {
          outputText += `➤${usage}\n`;
        });
      }

      Messages.sendMessageToReply(session, outputText);
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
