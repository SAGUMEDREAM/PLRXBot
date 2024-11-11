import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandSign} from "./command/CommandSign";
import {CommandTHSearch} from "./command/CommandTHSearch";
import {CommandKick} from "./command/CommandKick";
import {CommandMute} from "./command/CommandMute";
import {CommandDeMute} from "./command/CommandDeMute";
import {CommandCheckInv} from "./command/CommandCheckInv";
import {CommandUsage} from "./command/CommandUsage";
import {CommandLilySearch} from "./command/CommandLilySearch";
import {CommandLeaveMessage} from "./command/CommandLeaveMessage";
import {CommandCommandHelper} from "./command/CommandHelper";
import {CommandAbout} from "./command/CommandAbout";
import {CommandOS} from "./command/CommandOS";
import {PluginEvent, PluginListener} from "../../core/plugins/Plugins";
import {Messages} from "../../core/network/Messages";
import {CommandJRRP} from "./command/CommandJRRP";
import {CommandGroupSearch} from "./command/CommandGroupSearch";

export class EssentialsM extends PluginInitialization {
  constructor() {
    super("essentials_m");
  }
  public load(): void {
    const instance = CommandManager.getInstance();
    PluginListener.on(PluginEvent.MEMBER_JOIN_GROUP, this, (session, args) => {
      let result: string = '';
      result += Messages.at(Number(session?.event?.user?.id));
      result += ' 欢迎新人入群哦😊👍';
      Messages.sendMessage(session, result);
    });
    PluginListener.on(PluginEvent.BOT_JOIN_GROUP, this, (session, args) => {
      let introMessage = ``;
      introMessage += `大家好！我是蓬莱人形Bot，很高兴为大家提供帮助！\n`;
      introMessage += `你可以使用以下命令了解我的功能：\n`;
      introMessage += `/help - 查看所有可用命令和使用方法\n`;
      introMessage += `/搜索群组 - 搜索地区或活动的东方相关群组信息\n`;
      introMessage += `/搜索活动 - 搜索东方Project线下活动信息\n`;
      introMessage += `/莉莉云 - 搜索莉莉云网盘文件\n`;
      introMessage += `/留言 - 给开发者留言\n`;
      introMessage += `/今日人品 - 获取当日运气值\n`;
      introMessage += `/关于 - 查询关于Bot的信息`;

      Messages.sendMessage(session, introMessage);
    });
    PluginListener.on(PluginEvent.INVITED_TO_GROUP, this, (session, args) => {
      let event = session.event;
      let user_id = event.user.id;
      let group_id = event?.channel?.id || event?.guild?.id;
      let strResult = ``;
      strResult += `用户${Messages.at(Number(user_id))} 试图邀请Bot加入至QQ群 ${group_id}`;
      Messages.sendMessageToGroup(session, 863842932, strResult);
    });

    instance.registerCommand("/踢出", CommandKick.get());
    instance.registerCommand("/禁言", CommandMute.get());
    instance.registerCommand("/解除禁言", CommandDeMute.get());

    instance.registerCommand("/菜单", CommandCommandHelper.get());
    instance.registerCommand("/help", CommandCommandHelper.get());
    instance.registerCommand("/帮助", CommandCommandHelper.get());
    instance.registerCommand("/usage", CommandUsage.get());
    instance.registerCommand("/用法", CommandUsage.get());
    instance.registerCommand("/留言", CommandLeaveMessage.get());
    instance.registerCommand("/sign", CommandSign.get());
    instance.registerCommand("/签到", CommandSign.get());
    instance.registerCommand("/view", CommandCheckInv.get());
    instance.registerCommand("/查询库存", CommandCheckInv.get());
    instance.registerCommand("/搜索活动", CommandTHSearch.get());
    instance.registerCommand("/活动搜索", CommandTHSearch.get());
    instance.registerCommand("/搜索群组", CommandGroupSearch.get());
    instance.registerCommand("/群组搜索", CommandGroupSearch.get());
    instance.registerCommand("/lily", CommandLilySearch.get());
    instance.registerCommand("/莉莉云", CommandLilySearch.get());
    instance.registerCommand("/about", CommandAbout.get());
    instance.registerCommand("/jrrp", CommandJRRP.get());
    instance.registerCommand("/今日人品", CommandJRRP.get());
    instance.registerCommand("/关于", CommandAbout.get());
    instance.registerCommand("/os", CommandOS.get());
  }
}
