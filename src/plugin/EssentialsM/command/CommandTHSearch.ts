import {CommandProvider} from "../../../core/command/CommandProvider";
import fetch from "node-fetch";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import {Text} from "../../../core/language/Text";

export class CommandTHSearch {
  public readonly root = new CommandProvider()
    .addArg("字段").addArg("-A 获取全部结果").addArg("-H 获取历史活动")
    .onExecute(async (session, args) => {
      if (args.merge() == "") {
        Messages.sendMessageToReply(session, `用法: ${"$搜索活动 [名字] [-A 可选,获取全部结果] [-H 可选 获取历史活动]"}`);
        return;
      }

      let isHis = false;
      let isAll = false;
      const allArg: string = args.merge();
      const title = args.get(0);
      const nowTimestamp = Date.now();

      if (allArg.includes("-A")) {
        isAll = true;
      }
      if (allArg.includes("-H")) {
        isHis = true;
      }

      let resultStr = `[${title}] 搜索结果>\n`;
      const api = [
        "https://thonly.cc/proxy_google_doc/v4/spreadsheets/13xQAWuJkd8u4PFfMpMOrpJSb4RAM1isENnkMUCFFpK4/values/Activities!A2:E150?key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw",
        "https://thonly.cc/proxy_google_doc/v4/spreadsheets/1XV_9hMVd2IKisLA5bk7hU8E7nyuXIQdE9hAe_xlCDmU/values/Activities!A2:E150?key=AIzaSyAKE37_qaMY4aYDHubmX_yfebfYmnx2HUw"
      ];

      const allResults = await Promise.all(api.map(url => {
        return fetch(url)
          .then(response => response.json())
          .then(data => {
            const arr = [];
            const values = data["values"];

            values.forEach((item: any[]) => {
              try {
                const obj = {
                  status: item[0],
                  name: item[1],
                  area: item[2],
                  time: item[3],
                  group_id: item[4],
                  timestamp: item[3] == "暂无" ? nowTimestamp + 8000 : new Date(item[3]).getTime()
                };

                if (obj.name && (obj.name.includes(title) || obj.area.includes(title) || obj.time.includes(title))) {
                  arr.push(obj);
                }
              } catch (e) {}
            });

            return arr.filter(result => result["time"] == "暂无" || result["timestamp"] > nowTimestamp || isHis);
          })
          .catch(error => {
            console.log(error);
            return [];
          });
      }));

      const combinedResults = allResults.flat();

      let j = isAll ? combinedResults.length : Math.min(5, combinedResults.length);

      for (let i = 0; i < j; i++) {
        let result = combinedResults[i];
        resultStr += `${i + 1}. ${result["name"]}\n`;
        resultStr += `- 地区: ${result["area"]}\n`;
        resultStr += `- 日期: ${result["time"]}\n`;
        resultStr += `- 群号: ${result["group_id"]}\n`;
      }

      if (combinedResults.length === 0) {
        resultStr += "没有找到相关活动\n";
      }

      resultStr += `\n数据提供: 东方Project线下活动维基(https://thonly.cc/)`;

      Messages.sendMessageToReply(session, resultStr);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
