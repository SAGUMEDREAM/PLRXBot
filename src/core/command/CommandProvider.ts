import {Context, Schema, Session} from 'koishi';
import {CommandArgs} from "./CommandArgs";
import {Channel, User} from "@koishijs/core";
import {Messages} from "../network/Messages";
import {MultiParameterBuilder, TypeOfParameter} from "./MultiParameter";
import {DeprecatedError} from "../impl/DeprecatedError";

export class CommandProvider {
  public static readonly leakArgs = (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => {
    Messages.sendMessage(session, "参数不完整");
  };
  public static readonly leakPermission = (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => {
    Messages.sendMessage(session, "权限不足");
  };

  public static T = "";
  private primaryKey: CommandProvider;
  private registryKey: string;
  private subCommands: Map<string, CommandProvider> = new Map<string, CommandProvider>();
  private executeCallback: ((session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => void) | null = null;
  private permissionCallback: ((session: Session<User.Field, Channel.Field, Context>) => boolean) | null = null;
  private args: string[] = [];
  private multiParameterBuilder: MultiParameterBuilder;

  public addSubCommand(subCommand: string, provider: CommandProvider): CommandProvider {
    this.subCommands.set(subCommand, provider);
    return this;
  }

  public onExecute(callback: (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => void): CommandProvider {
    this.executeCallback = callback;
    return this;
  }

  public requires(permissionCallback: (session: Session<User.Field, Channel.Field, Context>) => boolean): CommandProvider {
    this.permissionCallback = permissionCallback;
    return this;
  }

  /**
   @deprecated
   **/
  public addArg(key: string): CommandProvider {
    const deprecated = true;
    if (deprecated) {
      throw new DeprecatedError();
    }
    this.args.push(key);
    return this;
  }

  public addRequiredArgument(name: string, key: string) {
    this.getMultiParameterBuilder().addRequired(name, key);
    return this;
  }

  public addOptionalArgument(name: string, key: string, defaultValue: any = null) {
    this.getMultiParameterBuilder().addOptional(name, key, defaultValue);
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

  public executeWith(session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) {
    if (this.permissionCallback && !this.permissionCallback(session)) {
      Messages.sendMessageToReply(session, "你没有使用该命令的权限");
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
        const missingNames = missingParams.map(p => p.name).join("，");
        Messages.sendMessageToReply(session, `缺少必填参数: ${missingNames}`);
        return;
      }

      if (this.executeCallback) {
        this.executeCallback(session, args);
      }
      return;
    }

    const nextCommand = String(args.at(0)).trim();
    const subProvider = this.subCommands.get(nextCommand);

    if (subProvider) {
      const remainingArgs = new CommandArgs(subProvider, args.getRaw(), args.args.slice(1));

      const requiredParams = subProvider.getMultiParameterBuilder().getList()
        .filter((param) => param.type === TypeOfParameter.REQUIRED);

      const missingParams = requiredParams.filter((param) => {
        const value = remainingArgs.getMultiParameter().getMap().get(param.id);
        return value === undefined || value === null || value === "";
      });

      if (missingParams.length > 0) {
        const missingNames = missingParams.map(p => p.name).join("，");
        Messages.sendMessageToReply(session, `缺少必填参数: ${missingNames}`);
        return;
      }

      subProvider.executeWith(session, remainingArgs);
    } else {
      Messages.sendMessageToReply(session, "未知子命令节点");
    }
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

  public getPermissionCallback(): ((session: Session<User.Field, Channel.Field, Context>) => boolean) | null {
    return this.permissionCallback;
  }
}
