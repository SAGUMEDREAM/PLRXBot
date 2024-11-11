import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import fetch from "node-fetch";

export class CommandLilySearch {
  public root = new CommandProvider()
    .addArg("字段")
    .onExecute((session, args) => {
      const title = args.merge();
      if (title == "" || args.get(0) == null) {
        Messages.sendMessageToReply(session,"缺少参数");
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
        .then(result => {
          const code = result["code"];
          if(code != 200) {
            return;
          }
          const data = result["data"];
          const content = data["content"];
          let output = `[${title}]> 搜索结果:`
          let limit = 5;
          let i = 0;
          for (const packCtx of content) {
            if(i>limit) break;
            let name = packCtx["name"];
            let parent = packCtx["parent"];
            let url = this.resultUrl(parent,name);
            output += `\n名称:${name}`;
            output += `\n下载链接:${url}`;
            i++;
          }
          Messages.sendMessageToReply(session,output);

        })
        .catch(error => {
          Messages.sendMessageToReply(session,"请求失败");
        });
    })
  ;
  public resultUrl(parent: string,filename: string): string {
    return `https://cn.thdog.moe/${encodeURIComponent(parent)}/${encodeURIComponent(filename)}`;
  }
  public static get(): CommandProvider {
    return new this().root;
  }
}
