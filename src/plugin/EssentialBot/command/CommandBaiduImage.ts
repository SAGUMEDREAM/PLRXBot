import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import axios from "axios";
import {EssentialBot} from "../index";
import {MessageMerging} from "../../../core/network/MessageMerging";

export class CommandBaiduImage {
  public root = new CommandProvider()
    .addRequiredArgument("关键词", "keyword")
    .onExecute(async (session, args) => {
      const keyword = args.getArgumentsString();
      const api = `https://api.suyanw.cn/api/baidu_image_search.php?msg=${keyword}&type=json`;
      try {
        const response = await axios.get(api);
        if (response.status === 200) {
          const result = response.data;
          const data: {
            imageurl: string,
            fromURLHost: string,
            FromURL: string,
            width: number,
            height: number,
            type: string,
          }[] = result["data"];

          const messageMerging = MessageMerging.create(session);
          let output = ``
          data.slice(0, 8).forEach(obj => {
            let bl =
              obj.fromURLHost.includes("cpc.people")
              || obj.FromURL.includes("cpc.people")
              || obj.FromURL.includes("gov")
              || obj.FromURL.includes("xjp")
              || obj.fromURLHost.includes("gov")
              || obj.fromURLHost.includes("xjp")
              || obj.FromURL.includes("cnr.cn")
              || obj.fromURLHost.includes("cnr.cn")
              || obj.FromURL.includes("news")
              || obj.fromURLHost.includes("news")
              || obj.fromURLHost.includes("news")
              || obj.FromURL.includes("people.com")
              || obj.fromURLHost.includes("people.com")
              || obj.FromURL.includes("people")
              || obj.fromURLHost.includes("people")

            if(!bl) output += `${h.image(obj.imageurl).toString()}\n来源:${obj.FromURL}\n`;
          });
          messageMerging.put(output);
          Messages.sendMessage(session, messageMerging.get());
        } else {
          Messages.sendMessage(session, `获取失败`);
        }
      } catch (err) {
        EssentialBot.INSTANCE.pluginLogger.error(err);
        Messages.sendMessage(session, `获取失败`);
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
