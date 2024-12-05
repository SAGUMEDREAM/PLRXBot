import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {FunnyWords, FWMessage} from "../index";
import {Maths} from "../../../core/utils/Maths";

export class CommandWeirdSay {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      let keyword = args.merge();
      let result = await this.getMessage(keyword);
      Messages.sendMessage(session,result);

    })
    .addArg("关键词");

  private async getMessage(keyword: any | string | null) {
    if(keyword == null) {
      let element: FWMessage = Maths.getRandomElement(FunnyWords.MESSAGE_DB);
      return element.msg;
    } else {
      let arr = [];
      for (const element of FunnyWords.MESSAGE_DB) {
        if(element.msg.includes(keyword)) {
          arr.push(element);
        }
      }
      let result: string;
      if(arr.length == 0) {
        result = Maths.getRandomElement(FunnyWords.MESSAGE_DB).msg;
      } else {
        result = Maths.getRandomElement(arr).msg;
      }
      return result;
    }
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
