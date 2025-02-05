import {CommandProvider} from "../../../core/command/CommandProvider";
import {UserManager} from "../../../core/user/UserManager";
import {Text} from "../../../core/language/Text";
import {Messages} from "../../../core/network/Messages";
import {ItemStack, ItemStacks} from "../item/Item";
import {h} from "koishi";
import {Items} from "../item/Items";

export class CommandViewInv {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      const user = UserManager.get(session);
      if (user != null) {
        let mdList = ['## 您的背包库存:\n'];
        const itemStacks: ItemStacks = user["ITEM_STACKS"];
        if (itemStacks != null) {
          itemStacks.itemStack.forEach((itemStack: ItemStack) => {
            let item = Items.getItem(itemStack.item_id);
            mdList.push(`* \`${Text.of(item.getName())}\`：${itemStack.amount}\n`);
          });
        }
        Messages.sendMessageToReply(session, await Messages.getMarkdown(mdList));
      }

    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
