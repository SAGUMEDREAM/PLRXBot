import path from "path";
import { CommandProvider } from "../../../core/command/CommandProvider";
import fetch from "node-fetch";
import { Messages } from "../../../core/network/Messages";
import { Files } from "../../../core/utils/Files";
import { Utils } from "../../../core/utils/Utils";
import { SheetYears } from "../sheets/SheetYears";
import { MessageMerging } from "../../../core/network/MessageMerging";

export class CommandTHSearch {
  public static readonly cache_path = path.resolve(
    path.join(Utils.getRoot(), "data", "caches"),
    "thsearch_cache.json"
  );

  private static CACHE_DURATION = 12 * 60 * 60 * 1000;

  public readonly root = new CommandProvider()
    .addArg("字段")
    .addArg("-H 获取历史活动")
    .onExecute(async (session, args) => {
      const title = args.get(0);
      if (!title) {
        Messages.sendMessageToReply(session, `用法: ${"/搜索活动 [名字] [-H]"}`);
        return;
      }

      let cacheData = this.getCache();
      const nowTimestamp = Date.now();

      if (cacheData && nowTimestamp - cacheData.timestamp < CommandTHSearch.CACHE_DURATION) {
        this.sendSearchResults(session, cacheData.results, title, args);
      } else {
        const results = await this.fetchAndCacheData();
        this.sendSearchResults(session, results, title, args);
      }
    });

  private getCache(): { timestamp: number; results: any[] } | null {
    try {
      const data = Files.read(CommandTHSearch.cache_path);
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private setCache(data: { timestamp: number; results: any[] }): void {
    Files.write(CommandTHSearch.cache_path, JSON.stringify(data, null, 2));
  }

  private async fetchAndCacheData(): Promise<any[]> {
    const nowTimestamp = Date.now();
    const apiResults = await Promise.all(
      SheetYears.thonly_sheets_api.map((url) =>
        fetch(url)
          .then((response) => response.json())
          .then((data) => this.processAPIData(data, nowTimestamp))
          .catch((error) => {
            console.log(error);
            return [];
          })
      )
    );
    const allResults = apiResults.flat();
    this.setCache({ timestamp: nowTimestamp, results: allResults });
    return allResults;
  }

  private processAPIData(data: any, nowTimestamp: number): any[] {
    const results: any[] = [];
    const valueRanges = data.valueRanges || [];

    valueRanges.forEach((range: any) => {
      const values = range.values || [];
      values.forEach((item: any[]) => {
        try {
          const event = {
            status: item[0] || "",
            name: item[1] || "",
            area: item[2] || "",
            time: item[3] || "",
            group_id: item[4] || "",
            timestamp: item[3] === "暂无" ? nowTimestamp + 8000 : new Date(item[3]).getTime()
          };
          results.push(event);
        } catch (error) {
          console.error("Error processing event data:", error);
        }
      });
    });

    return results;
  }

  private sendSearchResults(session: any, results: any[], title: string, args: any): void {
    const nowTimestamp = Date.now();
    const isHis = args.merge().includes("-H");

    const filteredResults = results.filter((event) => {
      const isMatch = event.name.includes(title) || event.area.includes(title) || event.time.includes(title);
      const isValidTime = event.time === "暂无" || event.timestamp > nowTimestamp || isHis;
      return isMatch && isValidTime;
    });

    if (filteredResults.length === 0) {
      Messages.sendMessageToReply(session, `❗没有找到与 ${title} 相关的活动。`);
      return;
    }

    let merging = MessageMerging.create(session);
    merging.put(`>>>${title} 的搜索结果如下:\n✨共找到 ${filteredResults.length} 个结果。`, true);
    filteredResults.forEach((result, i) => {
      let resultText = ``;
      resultText += `名称: ${result.name}\n`;
      resultText += `地区: ${result.area}\n`;
      resultText += `日期: ${result.time}\n`;
      resultText += `群号: ${result.group_id}\n`;
      merging.put(resultText, true);
    });
    Messages.sendMessage(session, merging.get());
  }

  public static get(): CommandProvider {
    return new this().root;
  }
}
