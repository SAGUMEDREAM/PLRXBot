import {CommandProvider} from "../../../core/command/CommandProvider";
import {EcoSystem} from "../../EssentialBot/eco/Eco";
import {UserManager} from "../../../core/user/UserManager";
import {Messages} from "../../../core/network/Messages";
import {Tags} from "../tag/Tags";
import {Maths} from "../../../core/utils/Maths";
import {Item, ItemStacks} from "../item/Item";

export class CommandLuckyDraw {
  public root = new CommandProvider()
    .addArg("抽奖次数")
    .onExecute((session, args) => {
      const user = UserManager.get(session);
      const eco = EcoSystem.getSystem(user);
      const itemStacks = ItemStacks.getStacks(user);
      const pools = Array.from(Tags.lucky_draw_pool.list);
      const num = args.getNumber(0) ?? 1;
      if(eco != null && eco.ecoObj.balance < 100 * num) {
        Messages.sendMessageToReply(session, `您的余额不足 ${num} 円`)
        return;
      }
      const item: Item = Maths.getRandomElement(pools)
      itemStacks.addItem(item);
      eco.ecoObj.balance -= 100 * num;
      eco.save();
      user.save();
    })
  public static get(): CommandProvider {
    return new this().root;
  }
}
