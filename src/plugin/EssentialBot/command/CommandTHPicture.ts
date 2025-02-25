import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import {Files} from "../../../core/utils/Files";
import {Maths} from "../../../core/utils/Maths";
import {h} from "koishi";
import {pathToFileURL} from "node:url";


export class CommandTHPicture {
  private readonly url = path.resolve(path.join(Utils.getRoot(), 'assets', 'touhou_pic'));
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      const files = Files.getDir(this.url);
      if (!files || files.length == 0) {
        await Messages.sendMessageToReply(session, '图库数量不足');
        return;
      }
      const fileLink: string = Maths.getRandomElement(files);
      const imageUrl: string = pathToFileURL(path.join(fileLink)).href;
      await Messages.sendMessageToReply(session, h.image(imageUrl));
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
