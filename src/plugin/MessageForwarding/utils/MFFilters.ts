import { Context, Session } from "koishi";
import { Channel, User } from "@koishijs/core";
import { Messages } from "../../../core/network/Messages";
import path from "path";
import { Utils } from "../../../core/utils/Utils";
import { Files } from "../../../core/utils/Files";
import { PluginListener } from "../../../core/plugins/Plugins";
import { compareTwoStrings } from "../../../core/utils/StringSimilarity";
import {CommandManager} from "../../../core/command/CommandManager";

export class MFFilters {
  public static lexical_group: string[] = [
    "tho",
    "thp",
    "茶会",
    "活动群",
    "摊主群",
    "举办时间",
    "举办地点"
  ];

  public static MFCache: string[] = [];
  static {
  }
  public static group_id = 863842932;
  public static readonly cache_path = path.resolve(path.join(Utils.getRoot(), 'data', 'caches'), "message_forwarding_cache.json");

  public static handle(session: Session<User.Field, Channel.Field, Context>, args: any): void {
    const content_0 = session.content.toLowerCase();
    const content_1 = session.content;

    const filteredContent_1 = content_1.replace(/<\/?[^>]+(>|$)/g, "");

    if(CommandManager.getInstance().testCommand(content_1)) {
      return;
    }

    if (session.userId == session.bot.selfId) {
      return;
    }

    if (this.isSimilarToCached(filteredContent_1)) {
      return;
    }

    if(filteredContent_1.length < 45) {
      return;
    }

    const isInclude = this.lexical_group.some(value => filteredContent_1.includes(value.toLowerCase()));

    if (isInclude) {
      //const ctx = `接收到信息:\n用户名:${session.event?.user?.name}\n账号:${session.event?.user?.id}\n来源:${session.event?.channel?.id}\n消息:` + filteredContent_1;
      const ctx = session.content;
      this.MFCache.push(filteredContent_1.toString());
      this.save();
      Messages.sendMessageToGroup(session, this.group_id, ctx);
      PluginListener.cancel();
    }
  }


  public static save() {
    Files.write(this.cache_path, JSON.stringify({
      "cache": this.MFCache
    }, null, 2));
  }

  private static isSimilarToCached(newMessage: string): boolean {
    if (this.MFCache.length === 0) {
      console.log("Cache is empty, no similar message.");
      return false;
    }

    return this.MFCache.some(cachedMessage => {
      const isSimilar = this.isSimilar(newMessage, cachedMessage);
      return isSimilar;
    });
  }

  private static isSimilar(str1: string, str2: string, threshold: number = 0.67): boolean {
    const similarity = compareTwoStrings(str1, str2);
    return similarity >= threshold;
  }
}
