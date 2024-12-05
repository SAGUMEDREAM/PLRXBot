import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {UserProfile} from "../../../core/user/UserProfile";

export class CommandJRRP {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let user = UserManager.get(session);
      let timeMessage = this.getTimeMessage();
      let result = `${Messages.at(Number(session.userId))}${timeMessage} `;
      let luck = this.getDailyLuck(user);
      result += `你今天的运气值是: ${luck}\n`;
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

  private getDailyLuck(userProfile: UserProfile): number {
    const date = new Date();
    const dateString = date.toISOString().split("T")[0];

    if (!userProfile.profile.data["jrrp"] || userProfile.profile.data["jrrp"]["date"] !== dateString) {
      const newValue = this.getRandom();
      userProfile.profile.data["jrrp"] = {
        "date": dateString,
        "value": newValue,
      };
      userProfile.save();
      return newValue;
    }

    return userProfile.profile.data["jrrp"]["value"];
  }

  private getRandom(): number {
    return Math.floor(Math.random() * 101);
  }


  private getLuckMessage(luck: number): string {
    if (luck <= 30) {
      const badLuckMessages = [
        "唉，今天运气不太好呢，像是遇到了魔法的反噬。也许换个角度，会碰到意想不到的惊喜哦！",
        "运气不好，可能被妖怪缠上了，今天就得小心一点，别让他们捉弄了！",
        "今天的运气有点糟糕呢，仿佛被误入了诅咒的迷宫，似乎很难找到出路。"
      ];
      return badLuckMessages[Math.floor(Math.random() * badLuckMessages.length)];
    }

    if (luck <= 60) {
      const neutralLuckMessages = [
        "运气平平啊，不过就像幽幽子说的，‘偶尔的平凡，也是一种乐趣’。加油吧，没准好运就在前方等着你！",
        "今天不是最好的日子，但也不算太差。记得幽幽子曾经说过，‘平凡中的喜悦，也是幸福的一部分’。",
        "运气还行，像是你走在了春风中，虽然没有大风大浪，但也让你感受到轻柔的温暖。"
      ];
      return neutralLuckMessages[Math.floor(Math.random() * neutralLuckMessages.length)];
    }

    if (luck <= 100) {
      const goodLuckMessages = [
        "今天不错哦，感觉像是白玉楼的风景，温和又美好。就算有点波折，也总能迎来晴天。",
        "运气相当好呢，感觉今天的一切都变得更加顺利了，就像和八云紫的巧妙配合一样。",
        "今天的运气如同一场温暖的春雨，带来了些许的愉悦和安慰，未来充满了希望。"
      ];
      return goodLuckMessages[Math.floor(Math.random() * goodLuckMessages.length)];
    }

    if (luck <= 120) {
      const veryGoodLuckMessages = [
        "哇，今天真是好运满满，和萃香一样，处处都是惊喜和好事。做什么都顺利，一定是有神明在庇佑！",
        "今天运气好到爆，感觉一切都会变得轻松，像是被幸运的风吹拂着，走向幸福的道路。",
        "简直就是一天的幸运流星，带着好运向你飞来，任何困难都将轻松解决！"
      ];
      return veryGoodLuckMessages[Math.floor(Math.random() * veryGoodLuckMessages.length)];
    }

    const perfectLuckMessages = [
      "简直是连风都带着幸运的气息啊！像八云紫一样巧妙地掌握了好运，你的每一步都像是走在幸福的路上！",
      "今天的好运让你如同命运的宠儿，仿佛每一处都弥漫着幸运的气息。你的未来无限光明！",
      "运气好得无法形容，简直让人怀疑是不是被幻想的世界宠坏了，继续前进，幸运将永远跟随！"
    ];
    return perfectLuckMessages[Math.floor(Math.random() * perfectLuckMessages.length)];
  }


  public static get(): CommandProvider {
    return new this().root;
  }
}
