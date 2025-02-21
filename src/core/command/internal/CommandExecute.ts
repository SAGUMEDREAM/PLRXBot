import {CommandProvider} from "../CommandProvider";
import {CommandManager} from "../CommandManager";

export class CommandExecute {
  public readonly root = new CommandProvider()
    .requires(session => session.hasPermissionLevel(3))
    .addRequiredArgument('命令', 'command')
    .onExecute((session, args) => {
      const argumentsString = args.getArgumentsString();
      const strings = argumentsString.split('&&').map(str => str.trim()).filter(str => str.length > 0);
      for (const string of strings) {
        session.content = string;
        CommandManager.getInstance().parseCommand(session);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
