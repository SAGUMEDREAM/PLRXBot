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
import {CommandCommandHelper, HelperMarkdownList} from "./command/CommandHelper";
import {CommandAbout} from "./command/CommandAbout";
import {CommandOS} from "./command/CommandOS";
import {Messages} from "../../core/network/Messages";
import {CommandJRRP} from "./command/CommandJRRP";
import {CommandGroupSearch} from "./command/CommandGroupSearch";
import {UserInfo} from "../../core/user/UserInfo";
import {EcoSystem} from "./eco/Eco";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {ListenerArgs, PluginListener} from "../../core/plugins/PluginListener";
import {CustomDataFactory} from "../../core/data/CustomDataFactory";
import {CommandTHPicture} from "./command/CommandTHPicture";
import {CommandPing} from "./command/CommandPing";
import {GroupManager} from "../../core/group/GroupManager";
import {UserManager} from "../../core/user/UserManager";
import {Context, Element, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {contextOptional} from "../../index";
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
import {CommandRandomText} from "./command/CommandRandomText";
import {CommandRandomMember} from "./command/CommandRandomMember";
import {CommandRandomTouhouMusic} from "./command/CommandRandomTouhouMusic";
import {CommandRandomNumber} from "./command/CommandRandomNumber";
import {CommandRandomUUID} from "./command/CommandRandomUUID";
import {CommandUploadTHPictureContinuous} from "./command/CommandUploadTHPictureContinuous";
import {CommandBA} from "./command/CommandBA";
import {CommandRandomAnime} from "./command/CommandRandomAnime";
import {CommandCrazyThursday} from "./command/CommandCrazyThursday";
import {CommandHomo} from "./command/CommandHomo";
import {CommandBaiduImage} from "./command/CommandBaiduImage";
import {CommandXiBao} from "./command/CommandXiBao";
import {CommandBeiBao} from "./command/CommandBeiBao";
import {CommandAbbreviation} from "./command/CommandAbbreviation";
import {CommandTHWiki} from "./command/CommandTHWiki";
import {THPlayListManager} from "./utils/THPlayListManager";

export let poke_lock = false;
export const welcome_black_list = ["787712108", "589711336"]

export class EssentialBot extends PluginInitialization {
  public static INSTANCE: EssentialBot;
  public thPlayListManager: THPlayListManager = new THPlayListManager();

  constructor() {
    super("essential_bot");
    EssentialBot.INSTANCE = this;
  }

  public load(): void {
    const instance = this.commandManager;
    PluginListener.on(PluginEvent.MEMBER_JOIN_GROUP, this, async (session, args) => {
      if (welcome_black_list.includes(session.channelId)) return;
      let result: string = '';
      result += Messages.at(Number(session.userId));
      result += ' 欢迎新人入群哦😊👍';
      await Messages.sendMessage(session, result);
    });
    PluginListener.on(PluginEvent.BOT_JOIN_GROUP, this, async (session, args) => {
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

      await Messages.sendMessage(session, introMessage);
    });

    PluginListener.on(PluginEvent.REQUEST_FRIEND, this, async (session, args) => {
      let strResult = ``;
      let event = session.event;
      let user_id = session.userId;
      let group_id = session.channelId || session.guildId;
      let message_id = session.messageId
      strResult += `收到用户${Messages.at(user_id)} 的好友申请\n`;
      strResult += `用户名：${await Messages.getNickname(user_id)}\n`
      strResult += `用户ID：${user_id}\n`
      strResult += `验证消息：\n${event?._data?.comment}\n`
      strResult += `会话ID：${message_id}`

      await Messages.sendMessageToGroup(session, 863842932, strResult);
    });

    PluginListener.on(PluginEvent.INVITED_TO_GROUP, this, async (session, args) => {
      let user_id = session.userId;
      let group_id = session.channelId || session.guildId;
      let strResult = ``;
      strResult += `用户${Messages.at(user_id)} (${user_id}) 试图邀请Bot加入至QQ群 ${group_id}\n`;
      strResult += `会话ID: ${session.messageId}`;
      await Messages.sendMessageToGroup(session, 863842932, strResult);
    });

    PluginListener.on(PluginEvent.BY_AT, this, async (session, args, context) => {
      const elements: Element[] = session.elements;
      if (elements.length == 1) {
        const first: Element = elements[0];
        if (first.type == 'at' && first.attrs.id == session.selfId) {
          await Messages.sendMessage(session, await Messages.markdown(HelperMarkdownList));
        }
        context.cancel();
      }
    })

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
    instance.registerCommand(["THBWiki维基搜索", "thb搜索", "THB搜索", "东方百科", "thb"], CommandTHWiki.get());
    instance.registerCommand(["lily", "莉莉云"], CommandLilySearch.get());
    instance.registerCommand(["关于", "about"], CommandAbout.get());
    instance.registerCommand(["jrrp", "今日人品"], CommandJRRP.get());
    instance.registerCommand(["随机东方", "随机东方图", "random_touhou"], CommandTHPicture.get());
    instance.registerCommand(["随机动漫图", "随机二次元"], CommandRandomAnime.get());
    instance.registerCommand(["随机群友"], CommandRandomMember.get());
    instance.registerCommand(["随机数字"], CommandRandomNumber.get());
    instance.registerCommand(["随机UUID", "随机uuid"], CommandRandomUUID.get());
    instance.registerCommand(["随机东方原曲"], CommandRandomTouhouMusic.get());
    instance.registerCommand(["上传东方图"], CommandUploadTHPicture.get());
    instance.registerCommand(["上传东方图-连续"], CommandUploadTHPictureContinuous.get());
    instance.registerCommand(["活字印刷", "huozi"], CommandHuoZi.get());
    instance.registerCommand(["发病"], CommandRandomText.get());
    instance.registerCommand(["choice", "选择"], CommandChoice.get());
    instance.registerCommand(["随机星期四", "随机KFC", "随机kfc", "生成疯狂星期四", "tskfc"], CommandCrazyThursday.get());
    instance.registerCommand(["百度搜图"], CommandBaiduImage.get());
    instance.registerCommand(["恶臭论证"], CommandHomo.get());
    instance.registerCommand(["5k", "5K"], Command5K.get());
    instance.registerCommand(["ba", "BA"], CommandBA.get());
    instance.registerCommand(["喜报"], CommandXiBao.get());
    instance.registerCommand(["悲报"], CommandBeiBao.get());
    instance.registerCommand(["何意味"], CommandAbbreviation.get());
    instance.registerCommand(["markdown"], CommandMarkdown.get());
    instance.registerCommand(["os"], CommandOS.get());
    instance.registerCommand(["ping"], CommandPing.get());
    instance.registerCommand(["mcs"], CommandMCS.get());

    instance.registerCommand(["宣发"], CommandPromotion.get());

    CustomDataFactory.createKey("sign_system", {"timestamp": 0});
    CustomDataFactory.createKey("lucky_seed", 0);
    CustomDataFactory.createKey("eco_system", {"balance": 0});

    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, async (session, args) => {
      let content = session.content;
      if (Messages.isAtBot(session) && (content.includes("在吗") || content.includes("在吗?") || content.includes("在?"))) {
        await session.send("Bot在");
      }
    });

    // PluginListener.on(PluginEvent.REQUEST_FRIEND, this, session => {
    //   session.bot.handleFriendRequest(session.messageId, true);
    // })

    contextOptional.value.platform("onebot").on("notice", async (session: Session<User.Field, Channel.Field, Context>) => {
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
          await PluginListener.emit(PluginEvent.BY_POKED, session, ListenerArgs.create());
        } catch (ignored) {
          return;
        }
        await session.sendQueued("喂!(#`O′) 戳我干什么!!");
        setTimeout(() => {
          poke_lock = false;
        }, 30000);
      }
    });

    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, async (session, args) => {
      let content = session.content;
      if ((
        content.includes("/闭嘴") || content == ("!d"))
      ) {
        const user = await UserManager.get(session);
        let userId = String(user.getProfile().user_id);
        let hasPerm = user.hasPermissionLevel(3) || await (await GroupManager?.get(session))?.isGroupAdmin(userId);
        if (!hasPerm) {
          await Messages.sendMessageToReply(session, "哼,你管得着咱吗!?");
          return;
        }
        if (session.event.message?.quote) {
          const {channel, id} = session.event.message.quote;
          await session.bot.deleteMessage(channel.id, id);
        }
        await Messages.sendMessage(session, "咱再也不乱说话了");
      }
    });

    // 经济系统
    PluginListener.on(PluginEvent.LOADING_PROFILE, this.plugin_id, async (session, args) => {
      const user: UserInfo = args.get("user") as UserInfo;
      user.setCustom("INSTANCE_ECO", new EcoSystem(user));
    });
    PluginListener.on(PluginEvent.SAVING_PROFILE, this.plugin_id, async (session, args) => {
      const user: UserInfo = args.get("user") as UserInfo;
      const ecoSystem: EcoSystem = user.getCustom("INSTANCE_ECO");
      if(ecoSystem != null) ecoSystem.save();
    });
    //LilyShortLink.start();
  }
}
