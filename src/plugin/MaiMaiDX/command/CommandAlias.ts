import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {h} from "koishi";

export class CommandAlias {
  private root = new CommandProvider()
    .addRequiredArgument("名称", "name")
    .onExecute(async (session, args) => {
      let name = args.get("name");
      let sel_arr = [];
      let f_sel_arr = [];
      for (let arr of MaiMaiDX.INSTANCE.alias) {
        if(arr.includes(name)) {
          sel_arr = arr
          break;
        }
      }
      for (const str of sel_arr) {
        if(str!='') f_sel_arr.push(str)
      }
      let mdTexts = [
        `## ${name}的别名\n`,
      ]
      for (const fStr of f_sel_arr) {
        mdTexts.push(`* ${fStr}\n`)
      }
      let buffer = await Messages.markdown(mdTexts);
      await Messages.sendMessageToReply(session, buffer);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
