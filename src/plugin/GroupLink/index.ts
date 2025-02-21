import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {Config} from "../../core/data/Config";
import {PluginListener} from "../../core/plugins/PluginListener";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {Context, h, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {CommandManager} from "../../core/command/CommandManager";
import {BotList} from "../../core/config/BotList";
import {Messages} from "../../core/network/Messages";
import {CommandProvider} from "../../core/command/CommandProvider";

export abstract class BindData {
  group_id_1: string;
  group_id_2: string;
}

export abstract class GroupLinkConfig {
  binds: BindData[]
}

export class GroupLink extends PluginInitialization {
  public static INSTANCE: GroupLink;
  public config: Config<GroupLinkConfig>;

  constructor() {
    super("group_link");
    GroupLink.INSTANCE = this;
  }

  public getConfigBinds(): BindData[] {
    return this.config.getConfig().binds;
  }

  public getBind(groupId: string): BindData {
    const binds = this.getConfigBinds();
    for (const bind of binds) {
      if (bind.group_id_1 == groupId || bind.group_id_2 == groupId) {
        return bind;
      }
    }
    return null;
  }

  public load(): void {
    const commandManager = CommandManager.getInstance();
    this.config = Config.createConfig("group_link", {
      binds: []
    }, true) as Config<GroupLinkConfig>;
    commandManager.registerCommand(["添加互通"],
      new CommandProvider()
        .requires(session => session.hasPermissionLevel(4))
        .addRequiredArgument("目标群号1", "group_id_1")
        .addRequiredArgument("目标群号2", "group_id_2")
        .onExecute((session, args) => {
          const group_id_1 = args.getString("group_id_1");
          const group_id_2 = args.getString("group_id_2");
          this.getConfigBinds().push(
            {
              group_id_1: group_id_1,
              group_id_2: group_id_2
            }
          );
          this.config.save();
          Messages.sendMessageToReply(session, `${group_id_1} 已连接至 ${group_id_2}`);
        })
    );
    commandManager.registerCommand(["删除互通"],
      new CommandProvider()
        .requires(session => session.hasPermissionLevel(4))
        .addRequiredArgument("任意目标群号", "group_id")
        .onExecute((session, args) => {
          const bind = this.getBind(args.getString("group_id"));
          if (bind == null) {
            Messages.sendMessageToReply(session, "不存在该互通");
            return;
          }
          const group_id_1 = bind.group_id_1;
          const group_id_2 = bind.group_id_2;
          const binds = this.config.getConfig().binds;
          const index = binds.indexOf(bind, 0);
          if (index > -1) {
            binds.splice(index, 1);
          }
          this.config.save();
          Messages.sendMessageToReply(session, `解绑群号 ${group_id_1} ${group_id_2}`);
        })
    );
    PluginListener.on(PluginEvent.HANDLE_MESSAGE_BEFORE, this.plugin_id, (session: Session<User.Field, Channel.Field, Context>, ...args: any[]) => {
      if (session == null) {
        return;
      }
      const groupId = session?.event?.channel?.id || session?.event?.guild?.id;
      if (session.userId == session.bot.userId) {
        return;
      }
      if (BotList.getInstance().getConfigInstance().getConfig().list.includes(String(session.userId))) {
        return;
      }
      if (groupId == null) {
        return;
      }
      let usrName = `@${session.event.user.nick || session.event.user.name}`;
      let content: string = session.content;
      let elements: h[] = session.elements;
      let elements_result = ``;
      elements.forEach(element => {
        if (element.type == 'at') {
          elements_result += usrName;
        } else {
          elements_result += element;
        }
      });
      content = elements_result.toString();
      const bind = this.getBind(groupId);
      if (bind == null) {
        return;
      }
      if (commandManager.testCommand(content, session)) {
        return;
      }
      const message = `(${usrName}): ` + content;
      if (groupId == bind.group_id_1) {
        Messages.sendMessageToGroup(session, Number(bind.group_id_2), message);
      } else if (groupId == bind.group_id_2) {
        Messages.sendMessageToGroup(session, Number(bind.group_id_1), message);
      }
    });
  }

}
