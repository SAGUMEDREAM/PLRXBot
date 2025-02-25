import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import fetch from "node-fetch";
import {GroupDataObject} from "../impl/GroupDataObject";
import {GroupDataStorage} from "../impl/GroupDataStorage";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import {Files} from "../../../core/utils/Files";
import {MessageMerging} from "../../../core/network/MessageMerging";
import {EssentialBot} from "../index";
import {MultiPlatformCommandRunner} from "../../../core/command/MultiPlatformCommandRunner";
import {CommandArgs} from "../../../core/command/CommandArgs";

export class CommandGroupSearch {
  public readonly api = `https://thwiki.cc/api.php?action=parse&page=%E4%B8%9C%E6%96%B9%E7%9B%B8%E5%85%B3QQ%E7%BE%A4%E7%BB%84%E5%88%97%E8%A1%A8&prop=wikitext&format=json`;
  public readonly qqGroupRegex = /\{\{(QQ群|QQ群扩展)\|(.+?)\|(.+?)\|(\d+?)\|(.+?)\}\}/g;
  public readonly cleanRegex = /\|[^|]+/g;
  public readonly cleanEventNameRegex = /\[\[.*?\]\]/g;

  public readonly cache_path = path.resolve(
    path.join(Utils.getRoot(), "data", "caches"),
    "group_search_cache.json"
  );
  public static CACHE_DURATION = 12 * 60 * 60 * 1000 * 2 * 7;

  public root = new CommandProvider()
    .addRequiredArgument("关键词", "keyword")
    .addOptionalArgument("是否重载", "reload", false)
    .onExecute(async (session, args) => {
      const reload = args.getBoolean("reload");

      await Messages.sendMessageToReply(session, `正在搜索中...`);

      const cachedData = Files.read(this.cache_path);
      const cacheTimestamp = reload ? 0 : (cachedData ? JSON.parse(cachedData).timestamp : 0);


      if (Date.now() - cacheTimestamp < CommandGroupSearch.CACHE_DURATION) {
        const resultData = JSON.parse(cachedData).data as GroupDataStorage;
        await this.sendGroupResults(session, args, resultData);
      } else {
        await fetch(this.api)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            let parse = data["parse"];
            let wikitext = parse["wikitext"];
            let text: string = wikitext["*"];
            let text_result = text.split("\n");
            let resultData: GroupDataStorage = {
              data: []
            };

            text_result.forEach(value => {
              let match: any;
              while ((match = this.qqGroupRegex.exec(value)) !== null) {
                let group_name = match[5];
                group_name = group_name.replace(this.cleanRegex, "").trim();

                let event_name = match[3];
                event_name = event_name.replace(this.cleanEventNameRegex, "").trim();

                const group: GroupDataObject = {
                  city: match[2],
                  group_name: group_name,
                  event_name: event_name,
                  group_id: match[4],
                  type: match[1] === 'QQ群' ? '普通' : '扩展'
                };
                resultData.data.push(group);
              }
            });
            const cacheData = {
              timestamp: Date.now(),
              data: resultData
            };
            Files.write(this.cache_path, JSON.stringify(cacheData, null, 2));
            this.sendGroupResults(session, args, resultData);
          })
          .catch(async (error) => {
            EssentialBot.INSTANCE.pluginLogger.error(error);
            await Messages.sendMessageToReply(session, `无法获取数据，请稍后再试`);
          });
      }
    });

  private async sendGroupResults(session, args: CommandArgs, resultData: GroupDataStorage) {
    const keyword = args.get("keyword");
    if (resultData.data.length === 0) {
      await Messages.sendMessageToReply(session, `没有找到符合条件的群组😥`);
      return;
    }

    let filteredGroups = resultData.data.filter(group =>
      group.group_name.toLowerCase().includes(keyword.toLowerCase()) ||
      group.group_id.toLowerCase().includes(keyword.toLowerCase()) ||
      group.event_name.toLowerCase().includes(keyword.toLowerCase()) ||
      group.city.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filteredGroups.length === 0) {
      await Messages.sendMessageToReply(session, `没有找到符合条件的群组😥`);
      return;
    }

    const builder = MessageMerging.createBuilder(session);
    builder.put(`>>>${keyword} 的搜索结果如下:`, true);

    let resultText = '';
    filteredGroups.forEach((group, index) => {
      resultText += `群名称: ${group.group_name}\n`;
      resultText += `所属机构: ${group.event_name}\n`;
      resultText += `群号: ${group.group_id}\n`;
      resultText += `\n`;

      if ((index + 1) % 4 === 0 || index === filteredGroups.length - 1) {
        builder.put(resultText);
        resultText = '';
      }
    });

    builder.put("", true);
    builder.put("数据来源: https://touhou.group/", true);

    return await Messages.sendMessage(session, await builder.get());
  }


  public static get(): CommandProvider {
    return new this().root;
  }
}
