import {CommandProvider} from "../CommandProvider";
import {Utils} from "../../utils/Utils";
import {Messages} from "../../network/Messages";
import {CommandHelper} from "../CommandHelper";

export class CommandTree {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(2))
    .onExecute(async (session, args) => {
      const str = Utils.sliceArrayFrom(args.all(),0).toString();
      if (str == null || str == "") {
        await CommandProvider.leakArgs(session, args);
        return;
      }
      await Messages.sendMessageToReply(session, `${JSON.stringify(CommandHelper.parseCommandTreeToArray(str), null, 2)}`);
    })
  ;
  public static get(): CommandProvider{
    return new this().root;
  }
}
