import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandSign} from "./command/CommandSign";
import {CommandTHSearch} from "./command/CommandTHSearch";
import {CommandKick} from "./command/CommandKick";
import {CommandMute} from "./command/CommandMute";
import {CommandDeMute} from "./command/CommandDeMute";
import {CommandUsage} from "./command/CommandUsage";
import {CommandLilySearch} from "./command/CommandLilySearch";
import {CommandLeaveMessage} from "./command/CommandLeaveMessage";
import {CommandCommandHelper} from "./command/CommandHelper";
import {CommandAbout} from "./command/CommandAbout";
import {CommandOS} from "./command/CommandOS";
import {Messages} from "../../core/network/Messages";
import {CommandJRRP} from "./command/CommandJRRP";
import {CommandGroupSearch} from "./command/CommandGroupSearch";
import {UserProfile} from "../../core/user/UserProfile";
import {EcoSystem} from "./eco/Eco";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {PluginListener} from "../../core/plugins/PluginListener";
import {CustomDataFactory} from "../../core/data/CustomDataFactory";
import {CommandTHPicture} from "./command/CommandTHPicture";
import {CommandPing} from "./command/CommandPing";
import {GroupManager} from "../../core/group/GroupManager";
import {UserManager} from "../../core/user/UserManager";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {ctxInstance} from "../../index";
import {CommandAgreeInvite} from "./command/CommandAgreeInvite";
import {CommandRejectInvite} from "./command/CommandRejectInvite";
import {CommandBroadcast} from "./command/CommandBroadcast";
import {CommandMarkdown} from "./command/CommandMarkdown";
import {CommandHuoZi} from "./command/CommandHuoZi";
import {DisabledGroupList} from "../../core/config/DisabledGroupList";
import {CommandLike} from "./command/CommandLike";
import {CommandMCS} from "./command/CommandMCS";
import {Command5K} from "./command/Command5K";
import {CommandChoice} from "./command/CommandChoice";
import {CommandInfo} from "./command/CommandInfo";
import {CommandPromotion} from "./command/CommandPromotion";
import {CommandUploadTHPicture} from "./command/CommandUploadTHPicture";
import {CommandRejectFriend} from "./command/CommandRejectFriend";
import {CommandAgreeFriend} from "./command/CommandAgreeFriend";

export let poke_lock = false;
export const welcome_black_list = ["787712108", "589711336"]

export class EssentialBot extends PluginInitialization {
  public static INSTANCE: PluginInitialization;

  constructor() {
    super("essential_bot");
    EssentialBot.INSTANCE = this;
  }

  public load(): void {
    const instance = CommandManager.getInstance();
    PluginListener.on(PluginEvent.MEMBER_JOIN_GROUP, this, (session, args) => {
      if (welcome_black_list.includes(session?.event?.channel?.id)) return;
      let result: string = '';
      result += Messages.at(Number(session?.event?.user?.id));
      result += ' 欢迎新人入群哦😊👍';
      Messages.sendMessage(session, result);
    });
    PluginListener.on(PluginEvent.BOT_JOIN_GROUP, this, (session, args) => {
      let introMessage = ``;
      introMessage += `大家好！我是蓬莱人形Bot，很高兴为大家提供帮助！\n`;
      introMessage += `你可以使用以下命令了解我的功能：\n`;
      introMessage += `/帮助 - 查看所有可用命令和使用方法\n`;
      introMessage += `/搜索群组 - 搜索地区或活动的东方相关群组信息\n`;
      introMessage += `/搜索活动 - 搜索东方Project线下活动信息\n`;
      introMessage += `/莉莉云 - 搜索莉莉云网盘文件\n`;
      introMessage += `/宣发 - 自助东方宣发内容\n`;
      introMessage += `/留言 - 给开发者留言\n`;
      introMessage += `/今日人品 - 获取当日运气值\n`;
      introMessage += `/关于 - 查询关于Bot的信息`;

      Messages.sendMessage(session, introMessage);
    });

    PluginListener.on(PluginEvent.REQUEST_FRIEND, this,async (session, args) => {
      let strResult = ``;
      let event = session.event;
      let user_id = session.userId;
      let channel_id = event?.channel?.id || event?.guild?.id;
      let message_id = session.messageId
      strResult += `收到用户${Messages.at(user_id)} 的好友申请\n`;
      strResult += `用户名：${await Messages.getNickname(user_id)}\n`
      strResult += `用户ID：${user_id}\n`
      strResult += `验证消息：\n${event?._data?.comment}\n`
      strResult += `会话ID：${message_id}`

      Messages.sendMessageToGroup(session, 863842932, strResult);
    });

    PluginListener.on(PluginEvent.INVITED_TO_GROUP, this, (session, args) => {
      let event = session.event;
      let user_id = event.user.id;
      let group_id = event?.channel?.id || event?.guild?.id;
      let strResult = ``;
      strResult += `用户${Messages.at(user_id)} (${user_id}) 试图邀请Bot加入至QQ群 ${group_id}\n`;
      strResult += `会话ID: ${session.messageId}`;
      Messages.sendMessageToGroup(session, 863842932, strResult);
    });

    instance.registerCommand(["踢出"], CommandKick.get());
    instance.registerCommand(["禁言"], CommandMute.get());
    instance.registerCommand(["解除禁言"], CommandDeMute.get());
    instance.registerCommand(["同意加群"], CommandAgreeInvite.get());
    instance.registerCommand(["拒绝加群"], CommandRejectInvite.get());
    instance.registerCommand(["同意好友"], CommandAgreeFriend.get());
    instance.registerCommand(["拒绝好友"], CommandRejectFriend.get());
    instance.registerCommand(["消息广播"], CommandBroadcast.get());

    instance.registerCommand(["菜单", "help", "帮助"], CommandCommandHelper.get());
    instance.registerCommand(["usage", "用法"], CommandUsage.get());
    instance.registerCommand(["留言"], CommandLeaveMessage.get());
    instance.registerCommand(["sign", "签到"], CommandSign.get());
    instance.registerCommand(["info", "查询"], CommandInfo.get());
    instance.registerCommand(["like", "赞我"], CommandLike.get());
    instance.registerCommand(["搜索活动", "活动搜索"], CommandTHSearch.get());
    instance.registerCommand(["搜索群组", "群组搜索"], CommandGroupSearch.get());
    instance.registerCommand(["lily", "莉莉云"], CommandLilySearch.get());
    instance.registerCommand(["关于", "about"], CommandAbout.get());
    instance.registerCommand(["jrrp", "今日人品"], CommandJRRP.get());
    instance.registerCommand(["随机东方", "随机东方图", "random_touhou"], CommandTHPicture.get());
    instance.registerCommand(["上传东方图"], CommandUploadTHPicture.get());
    instance.registerCommand(["活字印刷", "huozi"], CommandHuoZi.get());
    instance.registerCommand(["choice", "选择"], CommandChoice.get());
    instance.registerCommand(["5k", "5K"], Command5K.get());
    instance.registerCommand(["markdown"], CommandMarkdown.get());
    instance.registerCommand(["os"], CommandOS.get());
    instance.registerCommand(["ping"], CommandPing.get());
    instance.registerCommand(["mcs"], CommandMCS.get());

    instance.registerCommand(["宣发"], CommandPromotion.get());

    CustomDataFactory.createKey("sign_system", {"timestamp": 0});
    CustomDataFactory.createKey("lucky_seed", 0);
    CustomDataFactory.createKey("eco_system", {"balance": 0});

    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      let content = session.content;
      if (Messages.isAtBot(session) && content.includes("在吗")) {
        session.send("Bot在");
      }
    });

    // PluginListener.on(PluginEvent.REQUEST_FRIEND, this, session => {
    //   session.bot.handleFriendRequest(session.messageId, true);
    // })

    ctxInstance.platform("onebot").on("notice", async (session: Session<User.Field, Channel.Field, Context>) => {
      if (session && DisabledGroupList.getInstance().getConfigInstance().getConfig().list.includes(session?.event?.channel?.id)) {
        return;
      }
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
        await session.sendQueued("喂!(#`O′) 戳我干什么!!");
        setTimeout(() => {
          poke_lock = false;
        }, 30000);
      }
    });


    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      let content = session.content;
      if ((
        content.includes("/闭嘴") || content == ("!d"))
      ) {
        let user = UserManager.get(session);
        let userId = String(user.getProfile().user_id);
        let hasPerm = user.hasPermissionLevel(3) || GroupManager?.get(session)?.isGroupAdmin(userId);
        if (!hasPerm) {
          Messages.sendMessageToReply(session, "哼,你管得着咱吗!?");
          return;
        }
        if (session.event.message?.quote) {
          const {channel, id} = session.event.message.quote;
          session.bot.deleteMessage(channel.id, id);
        }
        Messages.sendMessage(session, "咱再也不乱说话了");
      }
    });

    // 经济系统
    PluginListener.on(PluginEvent.LOADING_PROFILE, this.plugin_id, (session, args) => {
      const user: UserProfile = args;
      user["INSTANCE_ECO"] = new EcoSystem(user);
    });
    PluginListener.on(PluginEvent.SAVING_PROFILE, this.plugin_id, (session, args) => {
      const user: UserProfile = args;
      const instance: EcoSystem = user.getCustom("INSTANCE_ECO");
      if (instance && instance.save) instance.save();
    });
    //LilyShortLink.start();
  }
}
