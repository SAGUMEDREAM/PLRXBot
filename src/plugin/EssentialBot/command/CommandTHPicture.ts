import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

export class CommandTHPicture {
  public api_array: string[] = [
  ];
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let tag: string = args.mergeWithSpace() || null;
      let selected: string = "https://img.paulzzh.com/touhou/random?site=yandere";
      Messages.sendMessageToReply(session, Messages.image(selected));
    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
