import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import fetch from "node-fetch";
import {MessageMerging} from "../../../core/network/MessageMerging";

export class CommandLilySearch {
  public root = new CommandProvider()
    .addRequiredArgument("关键词", "keyword")
    .onExecute(async (session, args) => {
      const title = args.getArgumentsString();
      const url = "https://cn.thdog.moe/api/fs/search";
      const data = {
        parent: "/分流1",
        keywords: `${title}`,
        scope: 0,
        page: 1,
        per_page: 100,
        password: ""
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(async result => {
          const code = result["code"];
          if (code !== 200) {
            await Messages.sendMessageToReply(session, "请求失败，请稍后再试。");
            return;
          }

          const data = result["data"];
          const content = data["content"];

          if (content.length === 0) {
            await Messages.sendMessageToReply(session, `没有找到与【${title}】相关的文件。`);
            return;
          }

          const builder = MessageMerging.createBuilder(session);
          builder.put(`>>>${title} 的搜索结果如下:\n✨共找到 ${content.length} 个结果。`, true);

          for (const [index, packCtx] of content.entries()) {
            let name = packCtx["name"];
            let parent = packCtx["parent"];
            let url = `https://cn.thdog.moe/${encodeURIComponent(parent)}/${encodeURIComponent(name)}`;

            let resultText = ``;
            resultText += `文件名: ${name}\n`;
            resultText += `所属目录: ${parent}\n`;
            resultText += `下载链接: ${url}\n`;
            builder.put(resultText);
          }
          builder.put(`\n数据来源: https://touhou.group/`);

          await Messages.sendMessage(session, await builder.get());
        })
        .catch(async (error) => {
          await Messages.sendMessageToReply(session, "❌请求失败，请稍后再试。");
        });
    });



  // 修改 resultUrl 方法，调用本地短链接服务 (暂时弃用)
  public async resultUrl(parent: string, filename: string): Promise<string> {
    const originalUrl = `https://cn.thdog.moe/${encodeURIComponent(parent)}/${encodeURIComponent(filename)}`;
    return originalUrl;
    //return await this.getShortUrl(originalUrl);
  }

  public async getShortUrl(originalUrl: string): Promise<string> {
    const response = await fetch("https://reurl.cc/webapi/shorten/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: originalUrl })
    });

    if (response.ok) {
      const data = await response.json();
      return `https://reurl.cc/${data["url"]}`;
    } else {
      throw new Error("短链接生成失败");
    }
  }
  /*public async getShortUrl(originalUrl: string): Promise<string> {
    const response = await fetch("http://localhost:3987/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: originalUrl })
    });

    if (response.ok) {
      const data = await response.json();
      return data["shortUrl"];
    } else {
      throw new Error("短链接生成失败");
    }
  }*/

  public static get(): CommandProvider {
    return new this().root;
  }
}
