import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import {Files} from "../../../core/utils/Files";
import {Maths} from "../../../core/utils/Maths";
import {h} from "koishi";


export class CommandTHPicture {
  private url = path.resolve(path.join(Utils.getRoot(), 'assets', 'touhou_pic'));

  public root = new CommandProvider()
    .onExecute((session, args) => {
      const files = Files.getDir(this.url);
      if (!files || files.length == 0) {
        Messages.sendMessageToReply(session, '图库数量不足');
        return;
      }
      const fileLink = Maths.getRandomElement(files);

      Messages.sendMessageToReply(session, h('img', {src: `${fileLink}`}));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}

// export class CommandTHPicture {
//   public api_array: string[] = [
//   ];
//   public root = new CommandProvider()
//     .onExecute((session, args) => {
//       let tag: string = args.mergeWithSpace() || null;
//       let selected: string = "https://img.paulzzh.com/touhou/random?site=yandere";
//       Messages.sendMessageToReply(session, Messages.image(selected));
//     });
//   public static get(): CommandProvider {
//     return new this().root;
//   }
// }
