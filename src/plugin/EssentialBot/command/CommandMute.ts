import {CommandProvider} from "../../../core/command/CommandProvider";
import {GroupManager} from "../../../core/group/GroupManager";
import {Messages} from "../../../core/network/Messages";
import {botOptional} from "../../../index";

export class CommandMute {
  public root: CommandProvider = new CommandProvider()
    .addRequiredArgument("用户", "user")
    .addRequiredArgument("时间", "time")
    .onExecute(async (session, args) => {
      let target = args.getUserId("user");
      let duration = args.get("time");
      if (target == null || duration == null) {
        Messages.sendMessageToReply(session, "参数不完整");
        return;
      }

      duration = this.parseDuration(duration);

      const group = GroupManager.get(session);
      if (group) {
        let hasPerm = session.hasPermissionLevel(3);
        let isAdmin = await group.isGroupAdmin(session.event.user.id);
        let botIsAdmin = await group.isGroupAdmin(session.bot.user.id)
        if ((hasPerm || isAdmin) && botIsAdmin) {
          await botOptional.value?.muteGuildMember(session.event.guild.id, target, duration);
          const formattedDuration = this.formatDuration(duration);
          Messages.sendMessageToReply(session, `用户${Messages.at(target)}被禁言${formattedDuration}`);
        } else {
          if ((hasPerm || isAdmin)) {
            Messages.sendMessageToReply(session, "禁言失败");
          } else {
            Messages.sendMessageToReply(session, "你没有使用该命令的权限");
          }
        }
      }
    })

  protected formatDuration(ms: number): string {
    const days = Math.floor(ms / 86400000);
    ms %= 86400000;
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);

    let result = '';
    if (days > 0) result += `${days}天 `;
    if (hours > 0) result += `${hours}小时 `;
    if (minutes > 0) result += `${minutes}分钟`;

    return result.trim(); // 去除末尾多余的空格
  }

  protected parseDuration(input: string): number {
    const timeUnits = {
      d: 86400000, // 天 -> 毫秒
      h: 3600000,  // 小时 -> 毫秒
      m: 60000     // 分钟 -> 毫秒
    };

    let totalDuration = 0;
    const regex = /(\d+)([dhm])/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const value = parseInt(match[1]);
      const unit = match[2];

      if (unit in timeUnits) {
        totalDuration += value * timeUnits[unit];
      }
    }
    return totalDuration;
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
