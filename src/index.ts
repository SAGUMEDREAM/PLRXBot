import {Bot, Context, Logger, Session} from 'koishi'
import {Channel, User} from "@koishijs/core";
import {Start} from "./core/Start";
import {UserManager} from "./core/user/UserManager";
import {Filters} from "./core/utils/Filters";
import {Network} from "./core/network/Network";
import {GroupManager} from "./core/group/GroupManager";
import {PluginEvent} from "./core/plugins/PluginEvent";
import {PluginListener} from "./core/plugins/PluginListener";

export const LOGGER: Logger = new Logger("@kisin-reimu/bot");
export let ctxInstance: Context = null;
export let botInstance: Bot = null;
const exitListener = () => {
  UserManager.getInstance().getUserDataMap().forEach(user => user.save());
  LOGGER.info("The plug-in has been uninstalled");
};
Start.main();
export function apply(ctx: Context) {
  ctx.on('internal/session', (session) => {
    if(ctxInstance == null) ctxInstance = ctx;
    if(botInstance == null) botInstance = session.bot;
  });
  ctx.on('friend-request',(session: Session<User.Field,Channel.Field,Context>) => {
    PluginListener.emit(PluginEvent.REQUEST_FRIEND, session);
  });
  ctx.on('guild-added',(session: Session<User.Field,Channel.Field,Context>) => {
    PluginListener.emit(PluginEvent.BOT_JOIN_GROUP, session);
  });
  ctx.on('guild-request',(session: Session<User.Field,Channel.Field,Context>) => {
    PluginListener.emit(PluginEvent.INVITED_TO_GROUP, session);
  });
  ctx.on('guild-member-request',(session: Session<User.Field,Channel.Field,Context>) => {
    PluginListener.emit(PluginEvent.MEMBER_REQUEST_JOIN_GROUP, session);
  });
  ctx.on('guild-member-added',(session: Session<User.Field,Channel.Field,Context>) => {
    PluginListener.emit(PluginEvent.MEMBER_JOIN_GROUP, session);
  });
  ctx.on('message', (session: Session<User.Field,Channel.Field,Context>) => {
    if(ctxInstance == null || botInstance == null) return;

    if(!UserManager.exists(session.event.user.id)) {
      UserManager.createUser(session);
    }

    if(session?.event?.channel?.type == 0) {
      const group_id = session?.event?.channel?.id;
      if(group_id != null && !GroupManager.exists(group_id)) {
        GroupManager.createGroupData(group_id)
      }
    }

    if(!Filters.isLegal(session.content)) {
      return;
    }

    try {PluginListener.emit(PluginEvent.HANDLE_MESSAGE_BEFORE, session);} catch (i) {return;}
    Network.handle(session);
    try {PluginListener.emit(PluginEvent.HANDLE_MESSAGE_AFTER, session);}catch (i) {return;}
  })
}

//process.on('SIGINT', exitListener);
//process.on('SIGTERM', exitListener);
//process.on('exit', exitListener);
