import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import axios from "axios";

export class CommandAbbreviation {
  public root = new CommandProvider()
    .addRequiredArgument('缩写', 'text')
    .onExecute(async (session, args) => {
      const text = args.get("text");
      try {
        const endpoint = `https://lab.magiconch.com/api/nbnhhsh/guess`;
        const response = await axios.post(endpoint, {text: text});
        const data = response.data;
        if (!data?.length) return Messages.sendMessageToReply(session, "何意味我也不知道啊");
        let result = data
          .map((entry: object) => `${entry["name"]}：${getResult(entry)}`)
          .join('\n')
          .trim() || null;
        if (result == `${text}：`) result = null;
        Messages.sendMessageToReply(session, result != null ? result : "何意味我也不知道啊");
      } catch (err) {
        Messages.sendMessageToReply(session, "何意味我也不造啊?")
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}

function getResult(entry: any) {
  if (entry["trans"]) return entry["trans"].join(', ')
  if (entry["inputting"]) return entry["inputting"].join(', ')
  return '未找到对应的缩写。'
}
