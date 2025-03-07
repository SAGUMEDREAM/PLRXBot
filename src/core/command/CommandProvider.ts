import {Context, Element, Session} from 'koishi';
import {CommandArgs} from "./CommandArgs";
import {Channel, User} from "@koishijs/core";
import {Messages} from "../network/Messages";
import {DataTypes, MultiParameterBuilder, Parameter, TypeOfParameter} from "./MultiParameter";
import {DeprecatedError} from "../impl/DeprecatedError";
import {CommandHelper} from "./CommandHelper";
import * as buffer from "buffer";
import {PluginListener} from "../plugins/PluginListener";
import {Plugins} from "../plugins/Plugins";

export class CommandProvider {
  public static readonly leakArgs = async (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => await Messages.sendMessage(session, "参数不完整");
  public static readonly leakPermission = async (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => await Messages.sendMessage(session, "权限不足");

  public static T = "";
  private plugin_id: string | null;
  private primaryKey: CommandProvider;
  private registryKey: string;
  private subCommands: Map<string, CommandProvider> = new Map<string, CommandProvider>();
  private executeCallback: ((session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => void) | ((session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => Promise<void>) | null = null;
  private permissionCallback: (session: Session<User.Field, Channel.Field, Context>) => Promise<boolean> | null = null;
  private platformType: string = "common";
  private isNoUsageHelp: boolean = false;
  private isDisabled: boolean = false;
  // private args: string[] = [];
  private multiParameterBuilder: MultiParameterBuilder;

  public addSubCommand(subCommand: string, provider: CommandProvider): CommandProvider {
    this.subCommands.set(subCommand, provider);
    return this;
  }

  public onExecute(callback: (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => void): CommandProvider {
    this.executeCallback = callback;
    return this;
  }

  public requires(permissionCallback: (session: Session<User.Field, Channel.Field, Context>) => Promise<boolean>): CommandProvider {
    this.permissionCallback = permissionCallback;
    return this;
  }

  public platform(platformType: string): CommandProvider {
    this.platformType = platformType;
    return this;
  }

  public noUsageHelp(bool = true): CommandProvider {
    this.isNoUsageHelp = bool;
    return this;
  }

  public disabledCommand(bool = true): CommandProvider {
    this.isDisabled = bool;
    return this;
  }

  public getDisabledCommand(): boolean {
    return this.isDisabled;
  }

  public getNoUsageHelp(): boolean {
    return this.isNoUsageHelp;
  }

  public addRequiredArgument(name: string, key: string, data_type: DataTypes = DataTypes.ANY) {
    this.getMultiParameterBuilder().addRequired(name, key, data_type);
    return this;
  }

  public addOptionalArgument(name: string, key: string, defaultValue: any = null, data_type: DataTypes = DataTypes.ANY) {
    this.getMultiParameterBuilder().addOptional(name, key, defaultValue, data_type);
    return this;
  }

  public setMultiParameterBuilder(builder: MultiParameterBuilder): CommandProvider {
    this.multiParameterBuilder = builder;
    return this;
  }

  public getMultiParameterBuilder(): MultiParameterBuilder {
    if (this.multiParameterBuilder == null) {
      this.multiParameterBuilder = MultiParameterBuilder.getBuilder()
    }
    return this.multiParameterBuilder;
  }

  public setPrimaryKey(provider: CommandProvider): CommandProvider {
    this.primaryKey = provider;
    return this;
  }

  public setRegistryKey(key: string): CommandProvider {
    this.registryKey = key;
    return this;
  }

  public getRegistryKey(): string {
    return this.registryKey;
  }

  public async executeWith(session: Session<User.Field, Channel.Field, Context>, args: CommandArgs): Promise<void> {
    const isCommon: boolean = this.platformType == "common";
    const isPlatform: boolean = session.platform == this.platformType;
    if (!isCommon) {
      if (!isPlatform) {
        return;
      }
    }

    if(this.isDisabled) {
      return;
    }

    const pluginId: string = this.getPluginId();
    if (Plugins.isDisabled(pluginId)) {
      return;
    }

    if (this.permissionCallback && await this.permissionCallback(session) == false) {
      await Messages.sendMessageToReply(session, "你没有使用该命令的权限");
      return;
    }

    if (args.size() == 0 || this.subCommands.size == 0) {
      const requiredParams = this.getMultiParameterBuilder().getList()
        .filter((param) => param.type === TypeOfParameter.REQUIRED);

      const missingParams = requiredParams.filter((param) => {
        const value = args.getMultiParameter().getMap().get(param.id);
        return value === undefined || value === null || value === "";
      });

      if (missingParams.length > 0) {
        const missingNames: string = missingParams.map((p: Parameter) => p.name).join("，");
        if (this.getNoUsageHelp()) return;
        const e = await CommandProvider.generateUsages(args.header);
        await Messages.sendMessageToReply(session, `缺少必填参数：${missingNames}\n用法：\n${e}`);
        return;
      }

      if (this.executeCallback) {
        if (this.executeCallback?.constructor?.name == 'AsyncFunction') {
          await this.executeCallback(session, args);
        } else {
          this.executeCallback(session, args);
        }
      }
      return;
    }

    const nextCommand = String(args.at(0)).trim();
    const subProvider = this.subCommands.get(nextCommand);

    if (subProvider) {
      const remainingArgs = new CommandArgs(subProvider, args.getRaw(), args.args.slice(1));

      const requiredParams = subProvider
        .getMultiParameterBuilder()
        .getList()
        .filter((param) => param.type === TypeOfParameter.REQUIRED);

      const missingParams = requiredParams.filter((param) => {
        const value = remainingArgs.getMultiParameter().getMap().get(param.id);
        return value === undefined || value === null || value === "";
      });

      if (missingParams.length > 0) {
        const missingNames = missingParams.map(p => p.name).join("，");
        if (this.getNoUsageHelp()) return;
        const e = await CommandProvider.generateUsages(args.header)
        await Messages.sendMessageToReply(session, `缺少必填参数：${missingNames}\n用法：\n${e}`);
        return;
      }

      await subProvider.executeWith(session, remainingArgs);
    } else {
      await Messages.sendMessageToReply(session, "未知子命令节点");
    }
  }

  public static async generateUsages(command: string): Promise<Element> {
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
    return await Messages.markdown(mdList);
  }

  private checkArgs(args: CommandArgs): boolean {
    return args.size() > 0;
  }

  public getPrimaryKey(): CommandProvider {
    return this.primaryKey;
  }

  public getArgsString(): string {
    let result = '';
    this.getMultiParameterBuilder().getList().forEach((parameter) => {
      result += ` ${parameter.asString()}`;
    })
    return result;
  }

  public getSubCommands(): Map<string, CommandProvider> {
    return this.subCommands;
  }

  public hasSubCommands(): boolean {
    return this.subCommands.size > 0;
  }

  public getPermissionCallback(): (session: Session<User.Field, Channel.Field, Context>) => Promise<boolean> {
    return this.permissionCallback;
  }

  public getPluginId(): string {
    return this.plugin_id;
  }

  public build(plugin_id: string | null): CommandProvider {
    if (plugin_id == null) {
      plugin_id = PluginListener.KoishiDefault;
    }
    this.plugin_id = plugin_id;
    return this;
  }
}
