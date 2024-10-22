import {CommandProvider} from "../../../core/command/CommandProvider";
import {CommandHelper} from "../../../core/command/CommandHelper";
import {Messages} from "../../../core/network/Messages";

export class CommandHelp {
  public root = new CommandProvider()
    .addArg("命令")
    .onExecute((session, args) => {
      if(session.bot.user.id == session.event.user.id) return;
      let cmd = args.get(0);
      if (args.get(0) == null) {
        CommandProvider.leakArgs(session, args);
        return;
      }
      const parsedCommand = CommandHelper.parseCommand(cmd);

      const formattedOutput = this.formatCommandTreeFlat(parsedCommand);
      Messages.sendMessageToReply(session,formattedOutput);
    });
  formatCommandTreeFlat(commandObj: any, parentCommand: string = '', depth: number = 0): string {
    let result = '';

    const currentCommand = parentCommand ? `${parentCommand} ${commandObj.command.split(' ').pop()}` : commandObj.command;

    result += `${' '.repeat(depth)}${currentCommand}\n`;

    if (commandObj.sub_commands && Object.keys(commandObj.sub_commands).length > 0) {
      for (const subCmdKey in commandObj.sub_commands) {
        const subCommand = commandObj.sub_commands[subCmdKey];
        result += this.formatCommandTreeFlat(subCommand, currentCommand, depth);
      }
    }

    return result;
  }
  public static get(): CommandProvider {
    return new this().root;
  }
}
