import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandSign} from "./command/CommandSign";
import {CommandTHSearch} from "./command/CommandTHSearch";
import {CommandKick} from "./command/CommandKick";
import {CommandMute} from "./command/CommandMute";
import {CommandDeMute} from "./command/CommandDeMute";
import {CommandCheckInv} from "./command/CommandCheckInv";
import {CommandHelp} from "./command/CommandHelp";
import {CommandLilySearch} from "./command/CommandLilySearch";
import {CommandLeaveMessage} from "./command/CommandLeaveMessage";

export class EssentialsM extends PluginInitialization {
  constructor() {
    super("essentials_m");
  }
  public load(): void {
    const instance = CommandManager.getInstance();

    instance.registerCommand("$踢出", CommandKick.get());
    instance.registerCommand("$禁言", CommandMute.get());
    instance.registerCommand("$解除禁言", CommandDeMute.get());

    instance.registerCommand("$help", CommandHelp.get());
    instance.registerCommand("$帮助", CommandHelp.get());
    instance.registerCommand("$留言", CommandLeaveMessage.get());
    instance.registerCommand("$sign", CommandSign.get());
    instance.registerCommand("$签到", CommandSign.get());
    instance.registerCommand("$view", CommandCheckInv.get());
    instance.registerCommand("$查询库存", CommandCheckInv.get());
    instance.registerCommand("$搜索活动", CommandTHSearch.get());
    instance.registerCommand("$莉莉云", CommandLilySearch.get());
  }
}
