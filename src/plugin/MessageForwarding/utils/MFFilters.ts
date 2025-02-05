import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {Messages} from "../../../core/network/Messages";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import {Files} from "../../../core/utils/Files";
import {compareTwoStrings} from "../../../core/utils/StringSimilarity";
import {CommandManager} from "../../../core/command/CommandManager";
import {PluginListener} from "../../../core/plugins/PluginListener";

export class MFFilters {
  public static readonly lexical_group: string[] = [
    "tho",
    "thp",
    "茶会",
    "活动群",
    "摊主群",
    "举办时间",
    "举办地点",
    "一宣",
    "二宣",
    "三宣",
    "终宣",
    "零宣",
    "报名",
    "新品",
    "推出",
    "接力",
    "招募",
    "活动",
    "制品",
    "最新",
    "上市",
    "交流群",
    "同好会",
    "社团群",
  ];

  public static filter_caches: string[] = [];
  public static target_group_id = 863842932;
  public static readonly cache_path = path.resolve(path.join(Utils.getRoot(), 'data', 'caches'), "message_forwarding_cache.json");

  static {
    this.loadCache();
  }

  private static loadCache() {
    const cacheData = Files.read(this.cache_path);
    const parsedData = JSON.parse(cacheData);
    const currentTime = Date.now();

    if (parsedData.time && currentTime - parsedData.time > 30 * 24 * 60 * 60 * 1000) {
      this.filter_caches = [];
    } else {
      this.filter_caches = parsedData.cache || [];
    }

    this.save();
  }

  public static handle(session: Session<User.Field, Channel.Field, Context>, args: any): void {
    // const content_0 = session.content.toLowerCase();
    const content_1 = session.content;

    const filteredContent_1 = content_1.replace(/<\/?[^>]+(>|$)/g, "");

    if (CommandManager.getInstance().testCommand(content_1)) {
      return;
    }

    if (session.userId == session.bot.selfId) {
      return;
    }

    if (this.isSimilarToCached(filteredContent_1)) {
      return;
    }

    if (filteredContent_1.length < 45) {
      return;
    }

    const isInclude = this.lexical_group.some(value => filteredContent_1.includes(value.toLowerCase()));

    if (isInclude) {
      const ctx = session.content;
      this.filter_caches.push(filteredContent_1.toString());
      this.save();
      Messages.sendMessageToGroup(session, this.target_group_id, ctx);
      PluginListener.cancel();
    }
  }

  public static save() {
    const data = {
      time: Date.now(),
      cache: this.filter_caches,
    };
    Files.write(this.cache_path, JSON.stringify(data, null, 2));
  }

  private static isSimilarToCached(newMessage: string): boolean {
    if (this.filter_caches.length === 0) {
      return false;
    }

    return this.filter_caches.some((cachedMessage: string) => {
      return this.isSimilar(newMessage, cachedMessage);
    });
  }

  private static isSimilar(str1: string, str2: string, threshold: number = 0.67): boolean {
    const similarity = compareTwoStrings(str1, str2);
    return similarity >= threshold;
  }
}
