import {Bot, Context, Logger, Session, h} from 'koishi'
import {Channel, User} from "@koishijs/core";
import {Start} from "./core/Start";
import {UserManager} from "./core/user/UserManager";
import {Filters} from "./core/utils/Filters";
import {MessageCHandler} from "./core/network/MessageCHandler";
import {GroupManager} from "./core/group/GroupManager";
import {PluginEvent} from "./core/plugins/PluginEvent";
import {PluginListener} from "./core/plugins/PluginListener";
import {Messages} from "./core/network/Messages";

export const LOGGER: Logger = new Logger("@kisin-reimu/bot");
export let ctxInstance: Context = null;
export let botInstance: Bot = null;
export let poke_lock = false;
const exitListener = () => {
  UserManager.getInstance().getUserDataMap().forEach(user => user.save());
  LOGGER.info("The plug-in has been uninstalled");
};
Start.main();

export function apply(ctx: Context) {
  ctx.on('internal/session', (session) => {
    if (ctxInstance == null) ctxInstance = ctx;
    if (botInstance == null) botInstance = session.bot;
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
  ctx.on('message', (session: Session<User.Field, Channel.Field, Context>) => {
    // Debug用
  });
  ctx.on('message', (session: Session<User.Field, Channel.Field, Context>) => {
    if (ctxInstance == null || botInstance == null) return;

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

    if (Messages.isAtBot(session)) {
      try {
        PluginListener.emit(PluginEvent.BY_AT, session);
      } catch (ignored) {
        return;
      }
      Messages.sendMessageToReply(session, "Bot不需要艾特使用哦");
      return;
    }

    try {
      PluginListener.emit(PluginEvent.HANDLE_MESSAGE_BEFORE, session);
    } catch (i) {
      return;
    }
    MessageCHandler.handle(session);
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
  ctx.platform("onebot").on("notice", async (session: Session<User.Field, Channel.Field, Context>) => {
    if (session.subtype != "poke") {
      return;
    }
    if (session.targetId == session.selfId) {
      if (poke_lock) {
        return;
      }
      poke_lock = true;
      try {
        PluginListener.emit(PluginEvent.BY_POKED, session);
      } catch (ignored) {
        return;
      }
      Messages.sendMessage(session, "喂!(#`O′) 戳我干什么!!");
      setTimeout(() => {
        poke_lock = false;
      }, 5000);
    }
  });
}

//process.on('SIGINT', exitListener);
//process.on('SIGTERM', exitListener);
//process.on('exit', exitListener);
