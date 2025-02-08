import { PluginInitialization } from "../../core/plugins/PluginInitialization";
import { botInstance, ctxInstance } from "../../index";
import { MessageMerging } from "../../core/network/MessageMerging";

export class DailyEvent extends PluginInitialization {
  private readonly apiBeta = [
    "https://thonly.cc/proxy_google_doc/v4/spreadsheets/13ykPzw9cKqQVXXEwhCuX_mitQegHdFHjZtGdqT6tlmk/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw",
    "https://thonly.cc/proxy_google_doc/v4/spreadsheets/1mMUsvTdyz07BtnLbs0WEr5gdvsRkjftnrek_n5HSdNU/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw"
  ];

  constructor() {
    super("daily_event");
  }

  public load(): void {
    ctxInstance.cron('0 12 * * *', async () => {
      await this.runDailyTask();
    });
  }

  public async runDailyTask(): Promise<void> {
    const taskContent = await this.getTaskContent();
    if (taskContent) {
      ctxInstance.broadcast(taskContent);
    }
  }

  public async getTaskContent() {
    let events7 = [];
    let events30 = [];
    const nowDate = Date.now();

    for (const url of this.apiBeta) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const valueRanges = data["valueRanges"];

        for (const sheet of valueRanges) {
          const event = sheet["values"];
          if (event[3] && event[3] !== "暂无") {
            const eventDate = new Date(event[3]).getTime();
            const dayDifference = (eventDate - nowDate) / (1000 * 60 * 60 * 24);
            if (dayDifference >= 6 && dayDifference < 7) {
              events7.push(event);
            }
            if (dayDifference > 29 && dayDifference < 30) {
              events30.push(event);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    }

    if (events30.length === 0 && events7.length === 0) return null;

    let merging = MessageMerging.create(null);

    merging.put(`每日活动倒计时🔈\n距离以下活动开始还有7天!`);
    for (let event of events7) {
      let name = event[1];
      let group = event[4];
      let text = `名称: ${name}\n群号: ${group}\n`;
      merging.put(text);
    }

    merging.put(`距离以下活动开始还有30天!`);
    for (let event of events30) {
      let name = event[1];
      let group = event[4];
      let text = `名称: ${name}\n群号: ${group}\n`;
      merging.put(text);
    }

    return merging.get();
  }
}
