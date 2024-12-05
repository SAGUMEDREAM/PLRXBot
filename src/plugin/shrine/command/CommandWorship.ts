import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {ShrineObject, Shrines} from "../index";
import {EcoSystem} from "../../EssentialBot/eco/Eco";
import {Maths} from "../../../core/utils/Maths";

export class CommandWorship {
  private readonly cost = 140;
  private readonly requiredFaith = 100;
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let result = "";
      let atUser = Messages.at(Number(session.userId))
      let user = UserManager.get(session);
      let shrine = Shrines.getObject(user);
      let eco = EcoSystem.getSystem(user);
      if (eco.ecoObj.balance >= this.cost) {
        shrine.faith += Maths.random(10, 40);
        shrine.count++;
        let b = this.checkLevelUp(shrine);
        eco.ecoObj.balance -= this.cost;
        eco.save();

        if(b) {
          result += `${atUser} 参拜成功！你的信仰度增加了 ${shrine.faith} 点，\n目前你的信仰等级已升级为 ${shrine.level} 级`;
        } else {
          result += `${atUser} 参拜成功！你的信仰度增加了 ${shrine.faith} 点。\n`;
        }
        result += `目前已参拜${shrine.count}次。`
      } else {
        result += `${atUser} 参拜神社需要 ${this.cost} 円!`;
      }
      Messages.sendMessageToReply(session, result);
    });

  private checkLevelUp(shrine: ShrineObject): boolean {
    let levelUp = false;
    while (shrine.faith >= this.requiredFaith) {
      shrine.level++;
      shrine.faith -= this.requiredFaith;
      levelUp = true;
    }
    return levelUp;
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
