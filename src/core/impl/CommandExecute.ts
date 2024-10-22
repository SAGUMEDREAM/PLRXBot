import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {CommandArgs} from "../command/CommandArgs";

export interface CommandExecute {
  execute(session: Session<User.Field,Channel.Field,Context>, args: CommandArgs): void;
}
