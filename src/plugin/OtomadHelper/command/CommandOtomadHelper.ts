import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MessageMerging} from "../../../core/network/MessageMerging";

export class CommandOtomadHelper {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      let builder = MessageMerging.createBuilder(session);
      let text = "";
      text += `使用方法:\n`;
      for (const element of this.list) {
        text += `/音MAD助手 ${element}\n`;
      }
      builder.put(text);
      await Messages.sendMessage(session, await builder.get());
    });
  public list: any[] = [];

  public addFast(s: string | string[], provider: CommandProvider): void {
    let i = 0;
    if (s instanceof Array) {
      for (const str of s) {
        this.root.addSubCommand(str, provider);
        if (i == 0) {
          i++;
          this.list.push(str);
        }
      }
    } else if (typeof s == 'string') {
      this.root.addSubCommand(s, provider);
      this.list.push(s);
    }
  }

  public static getInstance(): CommandOtomadHelper {
    return new this();
  }
}
