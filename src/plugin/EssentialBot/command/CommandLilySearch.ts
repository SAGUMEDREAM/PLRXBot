import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import fetch from "node-fetch";

export class CommandLilySearch {
  public root = new CommandProvider()
    .addArg("字段")
    .onExecute((session, args) => {
      const title = args.merge();
      if (title == "" || args.get(0) == null) {
        Messages.sendMessageToReply(session, "❗ 缺少搜索参数，请提供搜索关键词。");
        return;
      }

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
            Messages.sendMessageToReply(session, "❌ 请求失败，请稍后再试。");
            return;
          }

          const data = result["data"];
          const content = data["content"];
          let output = `🔍 【${title}】搜索结果：\n`;
          let limit = 5;
          let i = 0;

          for (const packCtx of content) {
            if (i >= limit) break;

            let name = packCtx["name"];
            let parent = packCtx["parent"];
            let url = await this.resultUrl(parent, name);

            output += `\n【${i + 1}】文件名: ${name}\n`;
            output += `  所属目录: ${parent}\n`;
            output += `  下载链接: ${url}\n`;
            output += `----------------------------------------\n`;
            i++;
          }

          if (content.length === 0) {
            output += `\n❗ 没有找到与【${title}】相关的文件。`;
          } else {
            output += `\n✨ 显示了前 ${i} 个结果。`;
            output += `\n更多结果请尝试修改搜索关键词或页码。`;
          }

          Messages.sendMessageToReply(session, output);
        })
        .catch(error => {
          Messages.sendMessageToReply(session, "❌ 请求失败，请稍后再试。");
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
