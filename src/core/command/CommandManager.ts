import {Context, h, Session} from "koishi";
import {CommandProvider} from "./CommandProvider";
import {CommandParser} from "./CommandParser";
import {CommandArgs} from "./CommandArgs";
import {Channel, User} from "@koishijs/core";
import {CommandHelper} from "./CommandHelper";
import {LOGGER} from "../../index";
import {CommandReload} from "./internal/CommandReload";
import {CommandPlugins} from "./internal/CommandPlugins";
import {CommandTree} from "./internal/CommandTree";
import {CommandDataFix} from "./internal/CommandDataFix";
import {CommandUser} from "./internal/CommandUser";
import {CommandGroup} from "./internal/CommandGroup";
import {CommandTestParameter} from "./internal/CommandTestParameter";
import {TypeOfParameter} from "./MultiParameter";
import {Constant} from "../Constant";
import {CommandOp} from "./internal/CommandOp";
import {CommandDeop} from "./internal/CommandDeop";
import {CommandPardon} from "./internal/CommandPardon";
import {CommandBan} from "./internal/CommandBan";
import {CommandExecute} from "./internal/CommandExecute";
import {CommandStop} from "./internal/CommandStop";

export class CommandManager {
  private constructor() {
  }

  private static readonly INSTANCE = new CommandManager();
  private providers: Map<string, CommandProvider> = new Map();
  private readonly provider_tree: { [key: string]: any } = {};

  public static create(): CommandManager {
    const instance = CommandManager.getInstance();
    // instance.registerCommand("$sudo", CommandSudo.get());
    instance.registerCommand(["user"], CommandUser.get());
    instance.registerCommand(["op"], CommandOp.get());
    instance.registerCommand(["deop"], CommandDeop.get());
    instance.registerCommand(["ban"], CommandBan.get());
    instance.registerCommand(["pardon"], CommandPardon.get());
    instance.registerCommand(["group"], CommandGroup.get());
    instance.registerCommand(["execute"], CommandExecute.get());
    instance.registerCommand(["tree"], CommandTree.get());
    instance.registerCommand(["datafix"], CommandDataFix.get());
    instance.registerCommand(["reload"], CommandReload.get())
    instance.registerCommand(["stop"], CommandStop.get())
    instance.registerCommand(["plugins"], CommandPlugins.get())

    instance.registerCommand(["测试参数"], CommandTestParameter.get());

    LOGGER.info("Loading Command Manager...");
    LOGGER.info("Loading Command System...");
    LOGGER.info("Loading Command Helper...");
    LOGGER.info("Loading Internal Commands...");
    return this.INSTANCE;
  }

  /*public static create(): CommandManager {
    const instance = CommandManager.getInstance();
    this.registerSimpleCommand(".MESSAGE_DATA", (session, args) => {
      Messages.sendMessage(session, (Messages.parse(session)).toString());
    });
    this.registerSimpleCommand(".MESSAGE_DATA_O", (session, args) => {
      Messages.sendMessage(session, (JSON.stringify(session)));
    });
    this.registerSimpleCommand(".MESSAGE_LOG", (session, args) => {
      console.log(session)
    });
    this.registerSimpleCommand(".SEND_TO_GROUP", (session, args) => {
      const user_id = session.event.user.id;
      const group_id = session.event.guild.id;
      const target = args.get(0);
      const messageSource = Utils.sliceArrayFrom(args.all(),1);
      const messages = [];
      messageSource.forEach((message) => {
        if(Utils.isHtmlTag(message)) {
          if(Utils.isImgTag(message)) {
            const src = Utils.getImgSrc(message);
            if(src) {
              messages.push(Messages.image(src));
            }
          } else {
            messages.push(message);
          }
        } else {
          messages.push(message);
        }
        //console.log(Utils.getHtmlTagObject(messages))
      });
      const result = messages.join('');

      session.bot.sendMessage(target,`${user_id} 在 ${group_id} 对本群发送了` + result);
    },(session) => UserManager.hasPermissionLevel(session,1));

    instance.registerCommand(".查询", new CommandProvider()
      .onExecute((session,args) => {

      })
      .addSubCommand("系统信息", new CommandProvider().onExecute((session,args) => {
        const systemName = os.type();
        const systemRelease = os.release();

        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();

        const maxMemoryInGB = (totalMemory / (1024 ** 3)).toFixed(2);
        const memoryInGB = (freeMemory / (1024 ** 3)).toFixed(2);
        Messages.sendMessage(session,`反馈结果:\n操作系统: ${systemName} ${systemRelease}\n内存信息: ${memoryInGB} / ${maxMemoryInGB} GB`)
      }))
      .addSubCommand("类型2", new CommandProvider().onExecute((session,args) => {

      }))
    );

    this.registerSimpleCommand(".DEBUG_GET_ARGS", (session, args) => {
      let i = 1;
      let argStr: string = "";
      args.all().forEach(value => {
        argStr += `参数${i}: ${value}\n`;
        i++;
      });
      Messages.sendMessage(session, "参数列表:\n" + argStr);
    });

    this.registerSimpleCommand(".DEBUG_PERM_CHECK",(session, args) => {
      Messages.sendMessage(session,"有权限");
    },(session) => {return UserManager.get(session).hasPermissionLevel(1)});

    this.registerSimpleCommand(".DEBUG_AT_ME", (session, args) => {
      Messages.sendMessage(session, "你好! " + Messages.at(Messages.parse(session).user.user_id));
    });

    this.registerSimpleCommand(".DEBUG_SEND_TO_GROUP", (session, args) => {
      const user_id = session.event.user.id;
      const group_id = session.event.guild.id;
      const target = args.get(0);
      const message = args.get(1);
      console.log(message)
      session.bot.sendMessage(target,`${user_id} 在 ${group_id} 对本群发送了` + message);
    },(session) => UserManager.hasPermissionLevel(session,1));

    this.registerSimpleCommand(".DEBUG_TEST_FILTERS", (session, args) => {
      session.send(String(Filters.isLegal(args.get(0))));
    });

    this.registerSimpleCommand(".DEBUG_GET_DIR", (session, args) => {
      session.send(Constant.USER_DATA_PATH);
    });

    this.registerSimpleCommand(".DEBUG_GET_USER_DATA_DIR", (session, args) => {
      session.send(Constant.DATA_PATH);
    });
    this.registerSimpleCommand(".DEBUG_GC", (session, args) => {
      global.gc();
      session.send("完成");
    });

    this.registerSimpleCommand(".DEBUG_NEXT_MESSAGE", (session, args) => {
      const user = UserManager.get(session);
      session.send("请输入下一句话");
      user.getProfileData()["next_message"]["open"] = true;
    });
    return this.INSTANCE;
  }*/

  public static getInstance(): CommandManager {
    return this.INSTANCE;
  }

  public registerCommand(commands: string | string[], provider: CommandProvider): void {
    if (Array.isArray(commands)) {
      commands.forEach((command) => {
        this._registerCommand(command, provider);
      });
    } else {
      this._registerCommand(commands, provider);
    }
  }

  private _registerCommand(command: string, provider: CommandProvider): void {
    if (command.startsWith('$')) {
      this.providers.set(command, provider);
      provider.setPrimaryKey(provider);
      provider.setRegistryKey(command);
      CommandHelper.build(command, provider);
      return;
    }

    const commandsToRegister = new Set<string>();

    if (command.startsWith('/')) {
      commandsToRegister.add(command.slice(1));
      commandsToRegister.add(command);
      commandsToRegister.add(`.${command.slice(1)}`);
    } else if (command.startsWith('.')) {
      commandsToRegister.add(command.slice(1));
      commandsToRegister.add(`/${command.slice(1)}`);
      commandsToRegister.add(command);
    } else {
      commandsToRegister.add(command);
      commandsToRegister.add(`/${command}`);
      commandsToRegister.add(`.${command}`);
    }

    commandsToRegister.forEach((cmd) => {
      if (this.providers.has(cmd)) {
        // LOGGER.warn(`Command ${cmd} has already been registered, this will overwrite the registration!`);
        return;
      }
      this.providers.set(cmd, provider);
      provider.setPrimaryKey(provider);
      provider.setRegistryKey(cmd);
      CommandHelper.build(cmd, provider);
    });
  }

  public static registerSimpleCommand(
    command: string,
    callback: (session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => void, permissionCallback?: ((session: Session<User.Field, Channel.Field, Context>) => boolean)): void {
    const instance = CommandManager.getInstance();
    const provider = new CommandProvider().onExecute((session, args) => callback(session, args))
    if (permissionCallback && typeof permissionCallback == 'function') {
      provider.requires(permissionCallback);
    }
    instance.registerCommand(command, provider);
    CommandHelper.build(command, provider);
  }

  public getProvider() {
    return this.providers;
  }

  /**
   * @deprecated
   */
  public buildCommandTree() {
    this.providers.forEach((provider: CommandProvider, command_root: string) => {
      if (provider.getSubCommands().size === 0) {
        this.provider_tree[command_root] = {
          usage: `${command_root}${provider.getArgsString()}`
        };
      } else {
        this.provider_tree[command_root] = {
          usage: `${command_root}${provider.getArgsString()}`
        };

        this.buildSubCommands(provider.getSubCommands(), `${command_root}`);
      }
    });
  }

  protected buildSubCommands(subCommands: Map<string, CommandProvider>, parent: string) {
    subCommands.forEach((subProvider: CommandProvider, subCommand: string) => {
      const fullCommand = `${parent} ${subCommand}`;

      if (subProvider.getSubCommands().size > 0) {
        this.provider_tree[fullCommand] = {
          usage: `${fullCommand}${subProvider.getArgsString()}`
        };
        this.buildSubCommands(subProvider.getSubCommands(), fullCommand);
      } else {
        this.provider_tree[fullCommand] = {
          usage: `${fullCommand}${subProvider.getArgsString()}`
        };
      }
    });
  }

  public getCommandTree() {
    return this.provider_tree;
  }

  public parseCommand(session: Session<User.Field, Channel.Field, Context>): void {
    const input = session.content;
    CommandManager.getInstance().executeCommand(session);
  }

  private executeCommand(session: Session<User.Field, Channel.Field, Context>) {
    let input: string = session.content;
    if (Constant.CONFIG.getConfig().config.enabled_command_at_parse_feature) {
      const elements = h.parse(input);
      const first = elements[0];

      if (first != null && first.type == 'at' && first.attrs.id == session.bot.userId) {
        elements.shift();

        input = elements.map(el => (typeof el === "string" ? el : el.toString())).join("").trim();

        if (!input) return;
      }
    }
    const parser = new CommandParser(input);
    const {command, args, raw} = parser.parse();

    const provider = this.providers.get(command);
    if (provider) {
      const commandArgs = new CommandArgs(provider, raw, args);
      provider.executeWith(session, commandArgs);
    }
  }

  public executeCommands(session: Session<User.Field, Channel.Field, Context>, commands: string): void {
    const strings = commands.split('&&').map(str => str.trim()).filter(str => str.length > 0);
    for (const string of strings) {
      session.content = string.trim();
      CommandManager.getInstance().parseCommand(session);
    }
  }

  public testCommand(command: string, session: Session<User.Field, Channel.Field, Context>): boolean {
    const cmdParser = command.trim().split(/\s+/);
    const rootCommand = cmdParser[0];

    const provider = this.providers.get(rootCommand);
    if (!provider) {
      return false;
    }

    const args = cmdParser.slice(1);
    const commandArgs = new CommandArgs(provider, command, args);

    if (provider.getPermissionCallback() && !provider.getPermissionCallback()(session)) {
      return false;
    }

    let currentProvider: CommandProvider | undefined = provider;
    let remainingArgs = commandArgs;

    while (remainingArgs.size() > 0 && currentProvider) {
      const nextCommand = remainingArgs.at(0);
      const subProvider = currentProvider.getSubCommands().get(nextCommand);

      if (!subProvider) {
        break;
      }

      currentProvider = subProvider;
      remainingArgs = new CommandArgs(subProvider, remainingArgs.getRaw(), remainingArgs.args.slice(1));
    }

    if (!currentProvider) {
      return false;
    }

    const requiredParams = currentProvider.getMultiParameterBuilder().getList()
      .filter((param) => param.type === TypeOfParameter.REQUIRED);

    const missingParams = requiredParams.filter((param) => {
      const value = remainingArgs.getMultiParameter().getMap().get(param.id);
      return value === undefined || value === null || value === "";
    });

    return missingParams.length === 0;
  }


  public static init(): void {
  };
}
