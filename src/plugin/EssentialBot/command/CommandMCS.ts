import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import {status} from "minecraft-server-util";
import {h} from "koishi";

export interface Status {
  description: string;
  players: { max: number; online: number };
  version: { name: string; protocol: number };
  favicon: string;
}

export class CommandMCS {
  public root = new CommandProvider()
    .addRequiredArgument("主机地址", "ip_address")
    .addOptionalArgument("端口", "port", 25565)
    .onExecute(async (session, args) => {
      const host: string = args.get("ip_address");
      const port: number = args.getNumber("port") || 25565;

      if(host == null) {
        CommandProvider.leakArgs(session, args);
        return
      }

      let mdList = [];
      mdList.push("## 服务器状态\n");

      let retryCount = 3;
      let success = false;

      for (let i = 0; i < retryCount; i++) {
        try {
          let response = await status(host, port);
          let data = {
            favicon: response.favicon,
            motd: response.motd.clean,
            version: response.version.name,
            playersOnline: response.players.online,
            maxPlayers: response.players.max,
          };

          mdList.push(`![服务器图标](${data.favicon} "服务器图标")\n`);
          mdList.push(`主机地址：${host}\n\n`);
          mdList.push(`端口号：${port}\n\n`);
          mdList.push(`玩家数量：${data.playersOnline}/${data.maxPlayers}\n\n`);
          mdList.push(`版本：${data.version}\n\n`);
          mdList.push(`描述：${data.motd} \n`);

          success = true;
          break;
        } catch (err) {
          // console.log(`第 ${i + 1} 次尝试失败:`, err.message);
          if (i === retryCount - 1) {
            mdList.push("解析失败\n");
          }
        }
      }

      Messages.sendMessageToReply(session, await Messages.getMarkdown(mdList));

    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
