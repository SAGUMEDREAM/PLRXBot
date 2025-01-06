import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {h} from "koishi";

export class CommandAlias {
  private root = new CommandProvider()
    .onExecute((session, args) => {
      let name = args.get(0);
      let sel_arr = [];
      let f_sel_arr = [];
      for (let arr of MaiMaiDX.onlyInstance.alias) {
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
      let buffer = Messages.generateMarkdown(mdTexts);
      Messages.sendMessageToReply(session, h.image(buffer, 'image/png'));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
