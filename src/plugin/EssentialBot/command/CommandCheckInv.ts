import {CommandProvider} from "../../../core/command/CommandProvider";
import {UserManager} from "../../../core/user/UserManager";
import {Inventory} from "../../Inventories/item/Inventory";
import {Text} from "../../../core/language/Text";
import {Messages} from "../../../core/network/Messages";

export class CommandCheckInv {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      const user = UserManager.get(session);
      if (user) {
        let result = '您的背包库存:\n';
        const inventory: Inventory = user.getCustom("INSTANCE_INVENTORY")
        if (inventory) {
          inventory.itemStacks.forEach((iStack, index) => {
            if (iStack.getCount() > 0) {
              result += `${index}.\n`;
              result += `名称: ${Text.of(iStack.getRegistryKey())}`;
              result += `数量: ${iStack.getCount()}`;
            }
          });
          Messages.sendMessageToReply(session, result);
        }
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
