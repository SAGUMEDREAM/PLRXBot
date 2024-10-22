import {CommandProvider} from "./CommandProvider";
import {CommandManager} from "./CommandManager";

export class CommandHelper {
  public static parseCommand(command: string = '') {
    const instance = CommandManager.getInstance();
    const provider = instance.getProvider().get(command);
    return CommandHelper.parse(provider, command);
  }
  public static parse(provider: CommandProvider, command: string = ''): any {
    const result: any = {
      command,
      registry_key: command,
      sub_commands: {},
    };

    try {
      provider.getSubCommands().forEach((subProvider, subCommand) => {
        const subCommandKey = `${command} ${subCommand}`.trim();
        result.sub_commands[subCommand] = this.parse(subProvider, subCommandKey);
      });

      result.registry_key = result.registry_key.replaceAll(' ', '.');
      result.command = command + provider.getArgsString();
    } catch (err) {}
    return result;
  }

}
