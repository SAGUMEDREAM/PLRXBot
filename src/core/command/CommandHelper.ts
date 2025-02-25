import {CommandProvider} from "./CommandProvider";
import {CommandManager} from "./CommandManager";
import {contextOptional} from "../../index";
import {Messages} from "../network/Messages";

// const ctx = contextOptional.get();
// let str: string;
// if (str != null) {
//   str = str.replaceAll(".", "");
//   str = str.replaceAll("/", "");
//   str = str.replaceAll("$", "");
//   str = str.replaceAll("(", "<")
//   str = str.replaceAll(">", ">")
//   ctx.command(str);
// }

export class CommandHelper {
  public static build(command: string, provider: CommandProvider) {
    const commandManager: CommandManager = CommandManager.getInstance();
    const provider_tree = commandManager.getCommandTree();
    if (provider.getSubCommands().size === 0) {
      provider_tree[command] = {
        usage: `${command}${provider.getArgsString()}`
      };
    } else {
      provider_tree[command] = {
        usage: `${command}${provider.getArgsString()}`
      };
      this.buildSubCommands(provider.getSubCommands(), `${command}`);
    }
  }

  public static buildSubCommands(subCommands: Map<string, CommandProvider>, parent: string) {
    let commandManager: CommandManager = CommandManager.getInstance();
    let provider_tree = commandManager.getCommandTree();
    subCommands.forEach((subProvider: CommandProvider, subCommand: string) => {
      const fullCommand = `${parent} ${subCommand}`;

      if (subProvider.getSubCommands().size > 0) {
        provider_tree[fullCommand] = {
          usage: `${fullCommand}${subProvider.getArgsString()}`
        };
        this.buildSubCommands(subProvider.getSubCommands(), fullCommand);
      } else {
        provider_tree[fullCommand] = {
          usage: `${fullCommand}${subProvider.getArgsString()}`
        };
      }
    });
  }

  public static parseCommandTreeToArray(command: string = '') {
    const instance = CommandManager.getInstance();
    let matching = [];
    let tree = instance.getCommandTree();
    Object.keys(tree).forEach((key: string) => {
      let value = tree[key];
      if (key.toLowerCase().includes(command.toLowerCase())) {
        matching.push(value.usage);
      }
    });
    return matching;
  }
}
