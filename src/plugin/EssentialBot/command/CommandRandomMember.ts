import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {Maths} from "../../../core/utils/Maths";

export class CommandRandomMember {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      const group_id = session?.event?.guild?.id || session?.event?.channel?.id;
      const guildMemberList = await session.bot.getGuildMemberList(group_id);
      const data = guildMemberList.data;
      const member = Maths.getRandomElement(data);
      const user_id = member.user.id;
      const result = "你的群友: " + Messages.at(user_id);
      Messages.sendMessageToReply(session, result);
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
