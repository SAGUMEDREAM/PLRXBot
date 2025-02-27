import {Bot, Context, Fragment, Logger, Random, Schema, Session} from 'koishi'
import {Channel, User} from "@koishijs/core";
import {Start} from "./core/Start";
import {UserManager} from "./core/user/UserManager";
import {Filters} from "./core/utils/Filters";
import {MessageCHandler} from "./core/network/MessageCHandler";
import {GroupManager} from "./core/group/GroupManager";
import {PluginEvent} from "./core/plugins/PluginEvent";
import {ListenerArgs, ListenerContext, PluginListener} from "./core/plugins/PluginListener";
import {Messages} from "./core/network/Messages";
import {DisabledGroupList} from "./core/config/DisabledGroupList";
import {BotList} from "./core/config/BotList";
import {KoishiServer} from "./core/server/KoishiServer";
import {OptionalValue} from "./core/utils/OptionalValue";
import {UserInfo} from "./core/user/UserInfo";

export const LOGGER: Logger = new Logger("@kisin-reimu/bot");
export const inject = {
  required: ['cron', 'puppeteer']
}

export type KoishiContextListener =
  | ((session: Session<User.Field, Channel.Field, Context>) => void)
  | ((session: Session<User.Field, Channel.Field, Context>) => Promise<void>);

export interface Config {
  rootPath: string;
}

interface RequestBody {
  sid: string
  to: string
  message: string
}


export const Config: Schema<Config> = Schema.object({
  rootPath: Schema.string().description("运行时根目录").default(`D:\\example\\bot`),
});

export const contextOptional: OptionalValue<Context> = new OptionalValue<Context>(null);
export let botOptional: OptionalValue<Bot> = new OptionalValue<Bot>(null);
export let onebotOptional: OptionalValue<any> = new OptionalValue<any>(null);
export let configOptional: OptionalValue<Config> = new OptionalValue<Config>(null)

export const applyHooks = new class {
  onSession: KoishiContextListener;
  onFriendRequest: KoishiContextListener;
  onGuildAdded: KoishiContextListener;
  onGuildRequest: KoishiContextListener;
  onGuildMemberRequest: KoishiContextListener;
  onGuildMemberAdded: KoishiContextListener;
  onMessage: KoishiContextListener;
}

export function apply(ctx: Context, config: Config) {
  if (contextOptional.value == null) contextOptional.value = ctx;
  if (configOptional.value == null) configOptional.value = config;
  ctx.on('ready', () => KoishiServer.getServer().open());
  ctx.on('dispose', () => KoishiServer.getServer().close());

  Start.main();
  const onSession: KoishiContextListener = (session: Session<User.Field, Channel.Field, Context>) => {
    if (contextOptional.value == null) contextOptional.value = ctx;
    if (botOptional.value == null) botOptional.value = session.bot;
    if (onebotOptional.value == null) onebotOptional.value = session.onebot;
    if (configOptional.value == null) configOptional.value = config;
  }
  const onFriendRequest: KoishiContextListener = async (session: Session<User.Field, Channel.Field, Context>) => await PluginListener.emit(PluginEvent.REQUEST_FRIEND, session, ListenerArgs.create());
  const onGuildAdded: KoishiContextListener = async (session: Session<User.Field, Channel.Field, Context>) => await PluginListener.emit(PluginEvent.BOT_JOIN_GROUP, session, ListenerArgs.create());
  const onGuildRequest: KoishiContextListener = async (session: Session<User.Field, Channel.Field, Context>) => await PluginListener.emit(PluginEvent.INVITED_TO_GROUP, session, ListenerArgs.create());
  const onGuildMemberRequest: KoishiContextListener = async (session: Session<User.Field, Channel.Field, Context>) => await PluginListener.emit(PluginEvent.MEMBER_REQUEST_JOIN_GROUP, session, ListenerArgs.create());
  const onGuildMemberAdded: KoishiContextListener = async (session: Session<User.Field, Channel.Field, Context>) => await PluginListener.emit(PluginEvent.MEMBER_JOIN_GROUP, session, ListenerArgs.create());
  const onMessage: KoishiContextListener = async (session: Session<User.Field, Channel.Field, Context>) => {
    if (contextOptional.value == null || botOptional.value == null) return;

    if (session == null) {
      return;
    }

    if (session.channelId == null && session.guildId != null) {
      session.channelId = session.guildId;
    } else if (session.guildId == null && session.channelId != null) {
      session.channelId = session.guildId;
    }

    session.qqguild;

    if (DisabledGroupList.getInstance().getConfigInstance().getConfig().list.includes(session.channelId)) {
      return;
    }

    if (!UserManager.exists(session.userId)) {
      await UserManager.createUser(session);
    }

    if (session?.event?.channel?.type == 0) {
      const group_id = session?.channelId;
      if (group_id != null && !GroupManager.exists(group_id)) {
        await GroupManager.createGroupData(group_id)
      }
    }

    if (!Filters.isLegal(session.content)) {
      return;
    }

    const user: UserInfo = await UserManager.get(session);
    if (user) {
      session.hasPermission = ((permission: any) => user.hasPermission(permission));
      session.hasPermissionLevel = ((permissionLevel: any) => user.hasPermissionLevel(permissionLevel));
      if (session?.event?.channel?.type == 0) {
        const group_id = session?.channelId;
        const groupInfo = await GroupManager.get(group_id);
        session.hasGroupPermission = (async (permission: any) => await groupInfo.isGroupAdmin(user.profile.user_id));
      } else {
        session.hasGroupPermission = (async (permission: any) => null);
      }
    } else {
      session.hasPermission = ((permission: any) => null);
      session.hasPermissionLevel = ((permissionLevel: any) => null);
    }

    if (Messages.isAtBot(session)) {
      const byAtContext: ListenerContext = await PluginListener.emit(PluginEvent.BY_AT, session, ListenerArgs.create());
      if (byAtContext.isCancel()) {
        return;
      }
    }

    if (session.userId == null || BotList.getInstance().getConfigInstance().getConfig().list.includes(String(session.userId))) {
      return;
    }

    const handleContext: ListenerContext = await PluginListener.emit(PluginEvent.HANDLE_MESSAGE_BEFORE, session, ListenerArgs.create().append("user", this));
    if (handleContext.isCancel()) {
      return;
    }

    await MessageCHandler.handle(session);

    const afterContext: ListenerContext = await PluginListener.emit(PluginEvent.HANDLE_MESSAGE_AFTER, session, ListenerArgs.create().append("user", this));
    if (afterContext.isCancel()) {
      return;
    }
  };

  ctx.on('internal/session', (session: Session<User.Field, Channel.Field, Context>) => onSession(session));
  ctx.on('friend-request', async (session: Session<User.Field, Channel.Field, Context>) => onFriendRequest(session));
  ctx.on('guild-added', async (session: Session<User.Field, Channel.Field, Context>) => onGuildAdded(session));
  ctx.on('guild-request', async (session: Session<User.Field, Channel.Field, Context>) => onGuildRequest(session));
  ctx.on('guild-member-request', async (session: Session<User.Field, Channel.Field, Context>) => onGuildMemberRequest(session));
  ctx.on('guild-member-added', async (session: Session<User.Field, Channel.Field, Context>) => onGuildMemberAdded(session));
  ctx.on('message', async (session: Session<User.Field, Channel.Field, Context>) => onMessage(session));
  // ctx.on('message', async (session: Session<User.Field, Channel.Field, Context>) => console.log("收到"));

  applyHooks.onSession = onSession;
  applyHooks.onFriendRequest = onFriendRequest;
  applyHooks.onGuildAdded = onGuildAdded;
  applyHooks.onGuildRequest = onGuildRequest;
  applyHooks.onGuildMemberRequest = onGuildMemberRequest;
  applyHooks.onGuildMemberAdded = onGuildMemberAdded;
  applyHooks.onMessage = onMessage;
}
