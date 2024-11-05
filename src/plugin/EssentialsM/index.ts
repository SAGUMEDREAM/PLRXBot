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

export class EssentialsM extends PluginInitialization {
  constructor() {
    super("essentials_m");
  }
  public load(): void {
    const instance = CommandManager.getInstance();

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
    instance.registerCommand("/lily", CommandLilySearch.get());
    instance.registerCommand("/莉莉云", CommandLilySearch.get());
    instance.registerCommand("/about", CommandAbout.get());
    instance.registerCommand("/关于", CommandAbout.get());
    instance.registerCommand("/os", CommandOS.get());
  }
}
