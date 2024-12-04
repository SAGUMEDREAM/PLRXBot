import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {UserProfile} from "../../../core/user/UserProfile";

export class CommandJRRP {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let user = UserManager.get(session);
      let timeMessage = this.getTimeMessage();
      let result = `${Messages.at(Number(session.userId))}${timeMessage}`;
      let luck = this.getDailyLuck(user);
      result += `你今天的运气值是: ${luck.toFixed(2)}\n`;
      result += this.getLuckMessage(luck);
      Messages.sendMessageToReply(session, result);
    });

  private getTimeMessage(): string {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return "早上好！";
    if (currentHour >= 12 && currentHour < 14) return "中午好！";
    if (currentHour >= 14 && currentHour < 18) return "下午好！";
    return "晚上好！";
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  private seededRandom(seed: number): number {
    return (seed * 9301 + 49297) % 233280 / 233280;
  }

  private getDailyLuck(userProfile: UserProfile): number {
    const now = new Date();
    const dateKey = now.toISOString().split("T")[0];
    const userId = userProfile.profile.user_id as string;
    let seed = userProfile.getDataKey("lucky_seed");

    if (seed === null || seed === undefined) {
      seed = this.hashString(userId);
      userProfile.setDataKey("lucky_seed", seed);
    }

    const combinedSeed = this.hashString(`${seed}${dateKey}`);
    const randomValue = this.seededRandom(combinedSeed);

    const mean = 75;
    const stddev = 25;
    const z0 = Math.sqrt(-2 * Math.log(randomValue)) * Math.cos(2 * Math.PI * randomValue);
    let luck = mean + z0 * stddev;

    return Math.max(0, Math.min(150, luck));
  }

  private getLuckMessage(luck: number): string {
    if (luck <= 30) return "今天有点倒霉，不过别灰心，说不定转角就遇到好运呢！";
    if (luck <= 60) return "运气平平，但别忘了，努力也是幸运的一部分，加油！";
    if (luck <= 100) return "今天不错哦，顺风顺水，或许能遇到些好事呢！";
    if (luck <= 120) return "哇，今天真棒！好运连连，做什么都感觉顺手极了！";
    return "你简直被幸运女神亲吻了！无敌的好运气，尽情享受吧！";
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
