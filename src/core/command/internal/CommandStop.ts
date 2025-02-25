import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";
import {Start} from "../../Start";

export class CommandStop {
  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .onExecute(async (session, args) => {
      await session.sendQueued("你确定要执行这个命令?(y/n)");
      const is = await session.prompt(8000);
      if(is == 'yes' || is == 'y') {
        await session.sendQueued("Bot进程已关闭");
        await Start.closingAndReloading(false);
        Start.exit();
        process.exit(0);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
