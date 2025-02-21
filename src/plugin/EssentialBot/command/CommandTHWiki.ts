import { CommandProvider } from "../../../core/command/CommandProvider";
import axios from "axios";
import { EssentialBot } from "../index";
import { MessageMerging } from "../../../core/network/MessageMerging";
import { Messages } from "../../../core/network/Messages";

export class CommandTHWiki {

  public readonly root = new CommandProvider()
    .addRequiredArgument("关键词", "keyword")
    .onExecute(async (session, args) => {
      const keyword = args.get("keyword");
      const endpoint: string = `https://thwiki.cc/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&format=json&srlimit=6`;

      try {
        const response = await axios.get(endpoint);
        const result = response.data;
        const query = result["query"];
        const searchinfo: { totalhits: number } = query["searchinfo"];
        const search: {
          ns: number,
          title: string,
          pageid: number,
          size: number,
          wordcount: number,
          snippet: string,
          timestamp: string
        }[] = query["search"];

        const merging = MessageMerging.create(session);
        merging.put(`THBWiki搜索关键词: ${keyword}\n关键词匹配总数: ${searchinfo.totalhits}展示1...6搜索结果：\n`);

        for (const mergingElement of search) {
          let snippet = cleanSnippet(mergingElement.snippet);

          let si = ``;
          si += `标题：${mergingElement.title}\n`;
          si += `链接：https://thwiki.cc/${encodeURIComponent(mergingElement.title)}\n`;
          si += `时间：${mergingElement.timestamp}\n`;
          si += `简介：${snippet}\n\n`;

          merging.put(si);
        }

        merging.put(`更多结果：https://thwiki.cc/index.php?search=${encodeURIComponent(keyword)}`);
        Messages.sendMessage(session, merging.get());
      } catch (err) {
        Messages.sendMessageToReply(session, "获取失败");
        EssentialBot.INSTANCE.pluginLogger.error(err);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}

function cleanSnippet(snippet: string): string {
  const withoutHTML = snippet.replace(/<\/?[^>]+(>|$)/g, "");

  const decodedSnippet = decodeURIComponent(withoutHTML.replace(/\\u[\dA-F]{4}/gi, match => String.fromCharCode(parseInt(match.replace('\\u', ''), 16))));

  const maxLength = 200;
  return decodedSnippet.length > maxLength ? decodedSnippet.substring(0, maxLength) + '...' : decodedSnippet;
}
