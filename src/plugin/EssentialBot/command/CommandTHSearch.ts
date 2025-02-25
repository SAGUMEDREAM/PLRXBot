import path from "path";
import {CommandProvider} from "../../../core/command/CommandProvider";
import fetch from "node-fetch";
import {Messages} from "../../../core/network/Messages";
import {Files} from "../../../core/utils/Files";
import {Utils} from "../../../core/utils/Utils";
import {SheetYears} from "../sheets/SheetYears";
import {MessageMerging} from "../../../core/network/MessageMerging";
import {EssentialBot} from "../index";
import {CommandArgs} from "../../../core/command/CommandArgs";
import fs from "fs";

export interface THSearchObject {
  status: string,
  name: string,
  area: string,
  time: string,
  group_id: string,
  timestamp: number
}

export class CommandTHSearch {
  public readonly cache_path = path.resolve(
    path.join(Utils.getRoot(), "data", "caches"),
    "thsearch_cache.json"
  );

  private static CACHE_DURATION = 12 * 60 * 60 * 1000;

  public readonly root = new CommandProvider()
    .addRequiredArgument("关键词", "keyword")
    .addOptionalArgument("历史模式", "history_mode", false)
    .addOptionalArgument("是否重载", "reload", false)
    .onExecute(async (session, args) => {
      const title = args.get("keyword");
      const history_mode = args.getBoolean("history_mode");
      const reload: boolean = args.getBoolean("reload");
      await Messages.sendMessageToReply(session, `正在搜索中...`);

      try {
        let cacheData = this.getCache();
        const nowTimestamp = Date.now();
        if (cacheData && reload == true) {
          cacheData.timestamp = 0;
          cacheData.results = [];
          this.setCache(cacheData);
        }

        if (cacheData && nowTimestamp - cacheData.timestamp < CommandTHSearch.CACHE_DURATION) {
          await this.sendSearchResults(session, cacheData.results, title, args);
        } else {
          const results = await this.getAndCacheData();
          await this.sendSearchResults(session, results, title, args);
        }
      } catch (error) {
        await Messages.sendMessageToReply(session, `搜索过程中出现错误`);
        EssentialBot.INSTANCE.pluginLogger.error(error)
      }
    });

  private getCache(): { timestamp: number; results: THSearchObject[] } | null {
    try {
      const data = Files.read(this.cache_path);
      return JSON.parse(data);
    } catch {
      fs.writeFileSync(this.cache_path, JSON.stringify({timestamp: 0, results: []}))
      return {timestamp: 0, results: []};
    }
  }

  private setCache(data: { timestamp: number; results: THSearchObject[] }): void {
    Files.write(this.cache_path, JSON.stringify(data, null, 2));
  }

  private async getAndCacheData(): Promise<THSearchObject[]> {
    const nowTimestamp = Date.now();
    const apiResults = await Promise.all(
      SheetYears.thonly_sheets_api.map((url) =>
        fetch(url)
          .then((response) => response.json())
          .then((data) => this.getAPIData(data, nowTimestamp))
          .catch((error) => {
            EssentialBot.INSTANCE.pluginLogger.error(error)
            return [];
          })
      )
    );
    const allResults = apiResults.flat();
    this.setCache({timestamp: nowTimestamp, results: allResults});
    return allResults;
  }

  private getAPIData(data: any, nowTimestamp: number): any[] {
    const results: any[] = [];
    const valueRanges = data.valueRanges || [];

    valueRanges.forEach((range: any) => {
      const values = range.values || [];
      values.forEach((item: any[]) => {
        try {
          const event: THSearchObject = {
            status: item[0] || "",
            name: item[1] || "",
            area: item[2] || "",
            time: item[3] || "",
            group_id: item[4] || "",
            timestamp: (item[3] === "暂无" || item[3] == null) ? nowTimestamp + 8000 : new Date(item[3]).getTime()
          };
          if (item != null && item.length >= 5) results.push(event);
        } catch (error) {
          EssentialBot.INSTANCE.pluginLogger.error(error)
        }
      });
    });

    return results;
  }

  private async sendSearchResults(session: any, results: THSearchObject[], title: string, args: CommandArgs): Promise<void> {
    const nowTimestamp = Date.now();
    const isHis = args.getBoolean("history_mode");

    const fResults = results.filter((event: THSearchObject) => {
      const isMatch =
        String(event.name || "").includes(title) ||
        String(event.group_id || "").includes(title) ||
        String(event.area || "").includes(title) ||
        String(event.time || "").includes(title);

      const isValidTime = event.time === "暂无" || (event.timestamp > nowTimestamp) || isHis;

      return isMatch && isValidTime;
    });

    if (fResults.length === 0) {
      await Messages.sendMessageToReply(session, `❗没有找到与 ${title} 相关的活动。`);
      return;
    }

    const builder: MessageMerging = MessageMerging.createBuilder(session);
    builder.put(`>>>${title} 的搜索结果如下:\n✨共找到 ${fResults.length} 个结果。`, true);
    fResults.forEach((result: THSearchObject, index: number) => {
      let resultText = ``;
      resultText += `名称: ${result.name}\n`;
      resultText += `地区: ${result.area}\n`;
      resultText += `日期: ${result.time}\n`;
      resultText += `群号: ${result.group_id}\n`;
      builder.put(resultText, true);
    });
    return await Messages.sendMessage(session, await builder.get());
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
