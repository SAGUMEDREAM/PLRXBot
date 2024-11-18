import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import { UserManager } from "../../../core/user/UserManager";
import { UserProfile } from "../../../core/user/UserProfile";

export class CommandJRRP {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let user = UserManager.get(session);
      let timeMessage = this.getTimeMessage();
      let result = '';
      result += `${timeMessage}，`;
      let luck = this.getDailyLuck(user);
      result += `你今天的运气值是: ${luck.toFixed(2)}\n`;
      result += (() => {
        let t = '';
        if (luck <= 30) {
          t = '今天的运气有点低哦，记得保持乐观，运气会变好的';
        } else if (luck <= 60) {
          t = '今天运气中等，稍微努力一些，幸运会向你微笑';
        } else if (luck <= 100) {
          t = '今天运气不错，心想事成的感觉！继续加油';
        } else if (luck <= 120) {
          t = '今天的运气非常好，幸运之神在向你招手！抓住机会';
        } else {
          t = '今天的运气超好，简直是好运爆棚，享受这一天吧';
        }
        return t;
      })();
      // result += `\n`;
      // result += Messages.image("https://img.paulzzh.com/touhou/random?site=yandere&size=wap&");
      Messages.sendMessageToReply(session, result);
    });
  private getTimeMessage(): string {
    const currentHour = new Date().getHours();
    let greeting = '';
    if (currentHour >= 6 && currentHour < 12) {
      greeting = '早上好！';
    } else if (currentHour >= 12 && currentHour < 14) {
      greeting = '中午好！';
    } else if (currentHour >= 14 && currentHour < 18) {
      greeting = '下午好！';
    } else {
      greeting = '晚上好！';
    }
    return greeting;
  }
  private seededRandom(seed: number): number {
    const a = 16807;
    const m = 2147483647;
    seed = (a * seed) % m;
    return seed / m;
  }

  private getDailyLuck(userProfile: UserProfile): number {
    const now = new Date();
    const user_id = userProfile.profile.user_id as string;
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    let seed = userProfile.getDataKey("lucky_seed");

    if (seed === null || seed === undefined) {
      if (isNaN(Number(user_id))) {
        seed = 0;
        for (let i = 0; i < user_id.length; i++) {
          seed += user_id.charCodeAt(i);
        }
      } else {
        seed = Number(user_id);
      }
      userProfile.setDataKey("lucky_seed", seed);
    }

    const combinedSeed = seed + (now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate());

    const random1 = this.seededRandom(combinedSeed);
    const random2 = this.seededRandom(combinedSeed + 1);

    const z0 = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);

    const mean = 75;
    const stddev = 25;

    let luck = mean + z0 * stddev;

    luck = Math.max(0, Math.min(150, luck));

    return luck;
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
