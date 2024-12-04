import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import {Networks} from "../../../core/network/Networks";

export class CommandPing {
  public root = new CommandProvider()
    .addArg("IP/DOMAIN")
    .onExecute(async (session, args) => {
      let target = args.get(0);
      let result = `${await Networks.ping(`${target}`)}ms`;
      Messages.sendMessageToReply(session, result);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
