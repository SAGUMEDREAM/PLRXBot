import {Context, Schema, Session} from 'koishi';
import {CommandArgs} from "./CommandArgs";
import {Channel, User} from "@koishijs/core";
import {Messages} from "../network/Messages";

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

  public addArg(key: string): CommandProvider {
    this.args.push(key);
    return this;
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

    if (args.size() === 0 || this.subCommands.size === 0) {
      if (this.executeCallback) {
        this.executeCallback(session, args);
      }
      return;
    }

    const nextCommand = args.get(0);
    const subProvider = this.subCommands.get(nextCommand || "");

    if (subProvider) {
      const remainingArgs = new CommandArgs(args.raw, args.args.slice(1));
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
    this.args.forEach(arg => {
      result += ` [${arg}]`;
    });
    return result;
  }

  public getSubCommands(): Map<string, CommandProvider> {
    return this.subCommands;
  }

  public hasSubCommands(): boolean {
    return this.subCommands.size > 0;
  }
}
