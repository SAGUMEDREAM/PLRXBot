import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {UserManager} from "../../../core/user/UserManager";
import {UserProfile} from "../../../core/user/UserProfile";
import {Files} from "../../../core/utils/Files";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import {Maths} from "../../../core/utils/Maths";
import {h} from "koishi";

export class CommandJRRP {
  public fortuneList: { [key: string]: string[] } = {};

  constructor() {
    this.load();
  }

  public add(type: string, texts: string[]) {
    if (this.fortuneList[type] == null) {
      this.fortuneList[type] = [];
    }
    let text = "";
    for (const msg of texts) {
      text += (msg + "\n");
    }
    this.fortuneList[type].push(text);
  }

  public load() {
    let data: object = JSON.parse(Files.read(path.resolve(path.join(Utils.getRoot(), 'assets'), "Touhou_Fortune_Slips.json")));
    let slips: [] = data["slips"];
    for (const slip of slips) {
      let content = slip["content"];
      let ct0: string = content[0];
      if (ct0.includes("大凶")) this.add("大凶", content);
      if (ct0.includes("凶")) this.add("凶", content);
      if (ct0.includes("吉")) this.add("吉", content);
      if (ct0.includes("大吉")) this.add("大吉", content);
      if (ct0.includes("末吉")) this.add("末吉", content);
      if (ct0.includes("小吉")) this.add("小吉", content);
      if (ct0.includes("纯粹")) this.add("纯粹", content);
      if (ct0.includes("中吉")) this.add("中吉", content);
      if (ct0.includes("小凶")) this.add("小凶", content);
      if (ct0.includes("空")) this.add("空", content);
    }
  }

  public root = new CommandProvider()
    .onExecute((session, args) => {
      let user = UserManager.get(session);
      let timeMessage = this.getTimeMessage();
      let result = `${timeMessage}${session.event.user.name}\n`;
      result += `你今天的运气值是: ${this.getDailyLuck(user)}\n抽到的御神签是：\n`;
      result += `${user.profile.data["jrrp"]["fortune"]}\n`;
      Messages.sendMessageToReply(session, result);

    });

  private getTimeMessage(): string {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return "早上好！";
    if (currentHour >= 12 && currentHour < 14) return "中午好！";
    if (currentHour >= 14 && currentHour < 18) return "下午好！";
    return "晚上好！";
  }

  private getDailyLuck(userProfile: UserProfile): number {
    const date = new Date();
    const dateString = date.toISOString().split("T")[0];

    if (!userProfile.profile.data["jrrp"] || userProfile.profile.data["jrrp"]["date"] !== dateString) {
      const newValue = this.getRandom();
      userProfile.profile.data["jrrp"] = {
        "date": dateString,
        "fortune": this.getLuckMessage(newValue),
        "value": newValue
      };
      userProfile.save();
      return newValue;
    }

    return userProfile.profile.data["jrrp"]["value"];
  }


  private getRandom(): number {
    return Math.floor(Math.random() * 140 + 1);
  }


  private getLuckMessage(luck: number): string {
    if (luck >= 0 && luck <= 14) {
      return Maths.getRandomElement(this.fortuneList["大凶"]);
    } else if (luck >= 15 && luck <= 28) {
      return Maths.getRandomElement(this.fortuneList["凶"]);
    } else if (luck >= 29 && luck <= 42) {
      return Maths.getRandomElement(this.fortuneList["小凶"]);
    } else if (luck >= 43 && luck <= 56) {
      return Maths.getRandomElement(this.fortuneList["空"]);
    } else if (luck >= 57 && luck <= 70) {
      return Maths.getRandomElement(this.fortuneList["末吉"]);
    } else if (luck >= 71 && luck <= 84) {
      return Maths.getRandomElement(this.fortuneList["吉"]);
    } else if (luck >= 85 && luck <= 98) {
      return Maths.getRandomElement(this.fortuneList["小吉"]);
    } else if (luck >= 99 && luck <= 112) {
      return Maths.getRandomElement(this.fortuneList["中吉"]);
    } else if (luck >= 113 && luck <= 126) {
      return Maths.getRandomElement(this.fortuneList["大吉"]);
    } else {
      return Maths.getRandomElement(this.fortuneList["纯粹"]);
    }
  }


  public static get(): CommandProvider {
    return new this().root;
  }
}
