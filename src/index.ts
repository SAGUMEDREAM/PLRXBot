import {Bot, Context, Logger, Schema, Session} from 'koishi'
import {Channel, User} from "@koishijs/core";
import {Start} from "./core/Start";
import {UserManager} from "./core/user/UserManager";
import {Filters} from "./core/utils/Filters";
import {MessageCHandler} from "./core/network/MessageCHandler";
import {GroupManager} from "./core/group/GroupManager";
import {PluginEvent} from "./core/plugins/PluginEvent";
import {PluginListener} from "./core/plugins/PluginListener";
import {Messages} from "./core/network/Messages";
import {DisabledGroupList} from "./core/config/DisabledGroupList";
import {BotList} from "./core/config/BotList";
import {KoishiServer} from "./core/server/KoishiServer";
import {OptionalValue} from "./core/utils/OptionalValue";

export const LOGGER: Logger = new Logger("@kisin-reimu/bot");
export const inject = {
  required: ['cron', 'puppeteer']
}

export interface Config {
  rootPath: string;
}

export const Config: Schema<Config> = Schema.object({
  rootPath: Schema.string().description("运行时根目录").default(`D:\\example\\bot`),
});

export const contextOptional: OptionalValue<Context> = new OptionalValue<Context>(null);
export let botOptional: OptionalValue<Bot> = new OptionalValue<Bot>(null);
export let onebotOptional: OptionalValue<any> = new OptionalValue<any>(null);
export let configOptional: OptionalValue<Config> = new OptionalValue<Config>(null)

export function apply(ctx: Context, config: Config) {
  if (contextOptional.value == null) contextOptional.value = ctx;
  if (configOptional.value == null) configOptional.value = config;
  ctx.on('ready', () => KoishiServer.getServer().open());
  ctx.on('dispose', () => KoishiServer.getServer().close());

  Start.main();
  ctx.on('internal/session', (session: Session<User.Field, Channel.Field, Context>) => {
    if (contextOptional.value == null) contextOptional.value = ctx;
    if (botOptional.value == null) botOptional.value = session.bot;
    if (onebotOptional.value == null) onebotOptional.value = session.onebot;
    if (configOptional.value == null) configOptional.value = config;
  });
  ctx.on('friend-request', (session: Session<User.Field, Channel.Field, Context>) => {
    PluginListener.emit(PluginEvent.REQUEST_FRIEND, session);
  });
  ctx.on('guild-added', (session: Session<User.Field, Channel.Field, Context>) => {
    PluginListener.emit(PluginEvent.BOT_JOIN_GROUP, session);
  });
  ctx.on('guild-request', (session: Session<User.Field, Channel.Field, Context>) => {
    PluginListener.emit(PluginEvent.INVITED_TO_GROUP, session);
  });
  ctx.on('guild-member-request', (session: Session<User.Field, Channel.Field, Context>) => {
    PluginListener.emit(PluginEvent.MEMBER_REQUEST_JOIN_GROUP, session);
  });
  ctx.on('guild-member-added', (session: Session<User.Field, Channel.Field, Context>) => {
    PluginListener.emit(PluginEvent.MEMBER_JOIN_GROUP, session);
  });
  ctx.on('message', async (session: Session<User.Field, Channel.Field, Context>) => {
    // Debug用
    // let content = session.content;
    // if(session.userId == '807131829' && session.bot.userId == session.userId && session.content.includes('/bytest')) {
    //   // console.log(session.elements);
    //   // Messages.sendMessage(session, session.content);
    // }
  });
  ctx.on('message', async (session: Session<User.Field, Channel.Field, Context>) => {
    if (contextOptional.value == null || botOptional.value == null) return;

    if (session == null) {
      return;
    }

    // if(session.userId != "807131829") return;
    // console.log(h.parse(session.content))

    if (DisabledGroupList.getInstance().getConfigInstance().getConfig().list.includes(session?.event?.channel?.id)) {
      return;
    }

    if (!UserManager.exists(session.event.user.id)) {
      UserManager.createUser(session);
    }

    if (session?.event?.channel?.type == 0) {
      const group_id = session?.event?.channel?.id;
      if (group_id != null && !GroupManager.exists(group_id)) {
        GroupManager.createGroupData(group_id)
      }
    }

    if (!Filters.isLegal(session.content)) {
      return;
    }

    session.hasPermission = ((permission: any) => UserManager.hasPermission(session, permission));
    session.hasPermissionLevel = ((permissionLevel: any) => UserManager.hasPermissionLevel(session, permissionLevel));
    session.hasGroupPermission = ((permission: any) => GroupManager.hasPermission(session, permission));

    if (Messages.isAtBot(session)) {
      try {
        PluginListener.emit(PluginEvent.BY_AT, session, []);
      } catch (ignored) {
        return;
      }
      // Messages.sendMessageToReply(session, "Bot不需要艾特使用哦");
      // return;
    }

    if (session.userId == null || BotList.getInstance().getConfigInstance().getConfig().list.includes(String(session.userId))) {
      return;
    }

    try {
      PluginListener.emit(PluginEvent.HANDLE_MESSAGE_BEFORE, session);
    } catch (i) {
      return;
    }

    await MessageCHandler.handle(session);
    try {
      PluginListener.emit(PluginEvent.HANDLE_MESSAGE_AFTER, session);
    } catch (i) {
      return;
    }
  });

  ctx.platform("onebot").on("message", async (session: Session<User.Field, Channel.Field, Context>) => {
    if (session.content === "/音频测试") {
      try {
        // Messages.sendAudio(session,"E:\\CloudMusic\\VipSongsDownload\\上海アリス幻樂団 - 恋色マスタースパーク.mp3");
      } catch (ignored) {

      }
    }

  });
}

//process.on('SIGINT', exitListener);
//process.on('SIGTERM', exitListener);
//process.on('exit', exitListener);
