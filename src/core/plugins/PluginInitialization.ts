import {Context, Logger, Session} from "koishi";
import {PluginInfo} from "./PluginInfo";
import {CommandManager} from "../command/CommandManager";
import {CommandProvider} from "../command/CommandProvider";
import {Channel, User} from "@koishijs/core";

export abstract class PluginInitialization {
  public plugin_name: string;
  public readonly plugin_id: string;
  public readonly pluginLogger: Logger;
  public pluginConfig: PluginInfo;
  public static INSTANCE: PluginInitialization;
  public commandManager: {
    registerCommand: (commands: string | string[], provider: CommandProvider) => CommandProvider | CommandProvider[]
    testCommand: (command: string, session: Session<User.Field, Channel.Field, Context>) => boolean
    getProvider: () => Map<string, CommandProvider>
    getCommand: (command: string) => CommandProvider
  };

  protected constructor(plugin_id: string) {
    this.plugin_id = plugin_id;
    this.pluginLogger = new Logger(`@kisin-reimu/bot_plugin/${this.plugin_id}`);
    this.commandManager = {
      registerCommand: this.registerCommand,
      testCommand: this.testCommand,
      getProvider: this.getProvider,
      getCommand: this.getCommand
    };
  }

  public registerCommand(commands: string | string[], provider: CommandProvider): CommandProvider | CommandProvider[] {
    const commandManager: CommandManager = CommandManager.getInstance();
    return commandManager.registerCommandWithPlugin(this, commands, provider);
  }

  public testCommand(command: string, session: Session<User.Field, Channel.Field, Context>): boolean {
    const commandManager: CommandManager = CommandManager.getInstance();
    return commandManager.testCommand(command, session);
  }

  public getCommand(command: string): CommandProvider {
    return this.getProvider().get(command);
  }

  public getProvider(): Map<string, CommandProvider> {
    const commandManager: CommandManager = CommandManager.getInstance();
    return commandManager.getProvider();
  }

  public abstract load(): void;
}
