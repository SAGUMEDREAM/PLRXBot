import {PluginInitialization} from "../../core/plugins/PluginInitialization";

export class DailyEvent extends PluginInitialization{
  private intervalId: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly apiBeta = [
    "https://thonly.cc/proxy_google_doc/v4/spreadsheets/13ykPzw9cKqQVXXEwhCuX_mitQegHdFHjZtGdqT6tlmk/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw",
    "https://thonly.cc/proxy_google_doc/v4/spreadsheets/1mMUsvTdyz07BtnLbs0WEr5gdvsRkjftnrek_n5HSdNU/values:batchGet?ranges=THO!A2:E200&ranges=THP%26tea-party!A2:E200&ranges=School!A2:E200&ranges=LIVE!A2:E200&key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw"
  ];

  constructor() {
    super("daily_event");
  }

  public load(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.timeoutId) clearTimeout(this.timeoutId);

    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

    this.timeoutId = setTimeout(() => {
      this.runDailyTask();
      this.intervalId = setInterval(this.runDailyTask.bind(this), 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  }

  public async runDailyTask(): Promise<void> {
    let events = [];
    let result = ``;
    const nowDate = Date.now();
    for (const url of this.apiBeta) {
      const response = await fetch(url);
      const data = await response.json();
      const valueRanges = data["valueRanges"];

      for (const sheet of valueRanges) {
        const event = sheet["values"];

        try {
          if(event[3] != "暂无") {
            const eventDate = new Date(event[3]).getTime();
            const dayDifference = Math.abs((eventDate - nowDate) / (1000 * 60 * 60 * 24));

            if (dayDifference > 29 && dayDifference < 30) {
              events.push(event);
            }
          }
        } catch (e) {}
      }
    }
    if(events.length == 0) return;
    result += `每日活动倒计时🔈🔈🔈\n`;
    result += `距离以下活动开始还有30天!:\n`;
    let index = 0;
    for (let event of events) {
      let name = event[1];
      let group = event[4];
      result += `${index+1}. ${name}\n`;
      result += ` 群号: ${group}\n`;
      index++;
    }
  }

}
