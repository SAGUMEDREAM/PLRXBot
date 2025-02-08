import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {Files} from "../../core/utils/Files";
import {CommandManager} from "../../core/command/CommandManager";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {PluginListener} from "../../core/plugins/PluginListener";
import {Config} from "../../core/data/Config";
import path from "path";
import {Utils} from "../../core/utils/Utils";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {compareTwoStrings} from "../../core/utils/StringSimilarity";
import {Messages} from "../../core/network/Messages";
import {Constant} from "../../core/Constant";


interface forwarding_cache_cfg {
  "time": number,
  "word_groups": string[]
  "target_group_id": number;
  "caches": string[],
}

const maxCacheSize = 50;

export class MessageForwarding extends PluginInitialization {
  public static INSTANCE: MessageForwarding;
  public readonly cache_path = path.resolve(path.join(Constant.CACHES_PATH), "message_forwarding_cache.json");
  public config: Config<forwarding_cache_cfg>;

  constructor() {
    super("message_forwarding");
    MessageForwarding.INSTANCE = this;
  }

  public load(): void {
    this.config = new Config(this.cache_path, {
      "time": 0,
      "word_groups": [],
      "target_group_id": null,
      "caches": []
    }, true);
    if (this.config.getConfig().target_group_id == null) {
      this.pluginLogger.warn(`The target group ID is empty and the message forwarding will not take effect!`);
      return;
    }
    PluginListener.on(PluginEvent.HANDLE_MESSAGE_AFTER, this, async (session, args) => {
      if (CommandManager.getInstance().getProvider().has(session.content.split(' ')[0])) return;
      this.handle(session, args);
    });
  }

  public handle(session: Session<User.Field, Channel.Field, Context>, args: any) {
    const content_1 = session.content;
    const hArray = session.elements;
    let length = 0;
    const filteredContent_1 = content_1.replace(/<\/?[^>]+(>|$)/g, "");
    if (this.config.getConfig().target_group_id == null) {
      return;
    }
    hArray.forEach(hElement => {
      if (hElement.type == 'text') length+=hElement.attrs.content.length;
      else length++;
    });
    if (length <= 35) {
      return;
    }
    if (CommandManager.getInstance().testCommand(content_1, session)) {
      return;
    }
    if (session.userId == session.bot.selfId) {
      return;
    }
    if (this.isSimilarToCached(filteredContent_1)) {
      return;
    }
    const isInclude = this.config.getConfig().word_groups.some(value => filteredContent_1.includes(value.toLowerCase()));

    if (isInclude) {
      const ctx = session.content;
      if (this.config.getConfig().caches.length > maxCacheSize) {
        this.config.getConfig().caches = this.config.getConfig().caches.slice(-maxCacheSize);
      }
      this.config.getConfig().caches.push(filteredContent_1.toString());
      this.config.getConfig().time = Date.now()
      this.config.save();
      Messages.sendMessageToGroup(session, this.config.getConfig().target_group_id, ctx);
      PluginListener.cancel();
    }
  }

  private isSimilarToCached(newMessage: string): boolean {
    if (this.config.getConfig().caches.length === 0) {
      return false;
    }

    return this.config.getConfig().caches.some((cachedMessage: string) => {
      return this.isSimilar(newMessage, cachedMessage);
    });
  }

  private isSimilar(str1: string, str2: string, threshold: number = 0.67): boolean {
    const similarity = compareTwoStrings(str1, str2);
    return similarity >= threshold;
  }
}
