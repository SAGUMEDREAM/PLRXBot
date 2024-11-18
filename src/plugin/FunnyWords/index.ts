import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandWeirdSay} from "./command/CommandWeirdSay";
import {Files} from "../../core/utils/Files";
import path from "path";
import {Utils} from "../../core/utils/Utils";
import nodejieba from "nodejieba";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../../core/user/UserManager";
import {Messages} from "../../core/network/Messages";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {PluginListener} from "../../core/plugins/PluginListener";
import {GroupManager} from "../../core/group/GroupManager";
export class FunnyWords extends PluginInitialization {
  constructor() {
    super("funny_words");
  }

  public static readonly cache_path = path.resolve(path.join(Utils.getRoot(), 'data', 'caches'), "funny_words_cache.json");
  public static readonly message_db_path = path.resolve(path.join(Utils.getRoot(), 'data', 'caches'), "message_db.json");
  public static CACHE = {
    subject: [],
    predicate: [],
    object: []
  };

  public static MESSAGE_DB: { [userId: string]: string[] } = {};

  private loadCache() {
    try {
      FunnyWords.MESSAGE_DB = JSON.parse(Files.read(FunnyWords.message_db_path));
    } catch (e) {
      FunnyWords.MESSAGE_DB = {};
    }

    try {
      FunnyWords.CACHE = JSON.parse(Files.read(FunnyWords.cache_path)) || {
        subject: [],
        predicate: [],
        object: []
      };;
    } catch (e) {
      FunnyWords.CACHE = {
        subject: [],
        predicate: [],
        object: []
      };
    }
  }
  public load(): void {
    const instance = CommandManager.getInstance();
    instance.registerCommand("/说怪话", CommandWeirdSay.get());
    this.loadCache();

    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      if (CommandManager.getInstance().getProvider().has(session.content.split(' ')[0])) return;
      this.speakImitate(session, session.content);
      this.parse(session.content);
      this.save();
    });

    this.save();
  }

  public speakImitate(session: Session<User.Field, Channel.Field, Context>, content: string) {
    if(CommandManager.getInstance().getProvider().has(session.content.split(' ')[0])) return;
    let user = UserManager.get(session);
    let userId = String(user.getProfile().user_id);

    if (
      Messages.isAtBot(session) && (
        content.includes("闭嘴") || content.toLowerCase().includes("!d"))
    ) {
      const hasPerm = user.hasPermissionLevel(3) || GroupManager?.get(session)?.isGroupAdmin(userId);
      if (!hasPerm) {
        Messages.sendMessageToReply(session, "哼,你管得着谁呢!?");
        return;
      }
      Messages.sendMessage(session, "咱再也不乱说话了");
      if (session.event.message?.quote) {
        const { channel, id } = session.event.message.quote;
        session.bot.deleteMessage(channel.id, id);
      }
      return;
    }

    if ((content.includes("/") && !content.includes("/>"))) {
      return;
    }

    if (Math.random() < 0.01) {
      this.handleRandomReply(session, content, userId);
      return;
    }

    if (Messages.isAtBot(session)) {
      this.handleRandomReply(session, content, userId);
      return;
    }

    if (FunnyWords.MESSAGE_DB[userId] == null) {
      FunnyWords.MESSAGE_DB[userId] = [];
    }
    if (!FunnyWords.MESSAGE_DB[userId].includes(content)) {
      content = content.replace(/<img[^>]*>/g, '');
      if(content == "") return;
      FunnyWords.MESSAGE_DB[userId].push(content);
    }
  }

  private handleRandomReply(session: Session<User.Field, Channel.Field, Context>, content: string, userId: string) {
    let random = Math.random();

    // 58% 概率从用户自定义消息中随机选择
    if (random < 0.58) {
      this.sendRandomMessage(session, userId);
    }
    // 30% 概率从所有用户消息中随机选择
    else if (random < 0.88) {
      this.sendRandomMessage(session);
    }
    // 剩余 12% 概率根据分词匹配来回复
    else {
      this.sendMessageByKeywordMatch(session, content);
    }

  }

  // 发送随机消息（从指定用户或所有用户的消息中选择）
  private sendRandomMessage(session: Session<User.Field, Channel.Field, Context>, userId?: string) {
    // 如果指定了 userId，则优先从该用户的消息池中随机选择
    let gMsgObj = userId && FunnyWords.MESSAGE_DB[userId]?.length > 0
      ? FunnyWords.MESSAGE_DB[userId]
      : Object.values(FunnyWords.MESSAGE_DB).flat();

    // 如果消息池为空，直接返回
    if (!gMsgObj || gMsgObj.length === 0) {
      Messages.sendMessage(session, "暂无可用消息");
      return;
    }

    // 从有效的消息池中随机选择消息
    const randomMessage = gMsgObj[Math.floor(Math.random() * gMsgObj.length)];
    Messages.sendMessage(session, randomMessage);
  }

  // 根据分词匹配内容来回复
  private sendMessageByKeywordMatch(session: Session<User.Field, Channel.Field, Context>, content: string) {
    const words = nodejieba.cut(content);
    let matched = false;

    for (let key in FunnyWords.MESSAGE_DB) {
      const messages = FunnyWords.MESSAGE_DB[key];
      for (let msg of messages) {
        if (words.some(word => msg.includes(word))) {
          Messages.sendMessage(session, msg);
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      this.sendRandomMessage(session);
    }
  }


  public static getRandomFromCache() {
    const randomArray = Math.random() < 0.5 ? FunnyWords.CACHE.subject : FunnyWords.CACHE.object;
    const randomIndex = Math.floor(Math.random() * randomArray.length);
    return randomArray[randomIndex];
  }

  public static getRandomPredicate() {
    const randomIndex = Math.floor(Math.random() * FunnyWords.CACHE.predicate.length);
    return FunnyWords.CACHE.predicate[randomIndex];
  }

  public parse(sentence: string) {
    sentence = sentence.replaceAll(/<\/?[^>]+(>|$)/g, "");
    const taggedWords = nodejieba.tag(sentence);
    taggedWords.forEach(({ word, tag }) => {
      if(word == "" || word == " ") {
        return;
      }
      if (tag === 'n' || tag === 'nr' || tag === 'ns' || tag === 'nt') {
        if(!FunnyWords.CACHE.subject.includes(word)) {
          FunnyWords.CACHE.subject.push(word);
        }
      } else if (tag === 'v' || tag === 'vd' || tag === 'vn') {
        if(!FunnyWords.CACHE.predicate.includes(word)) {
          FunnyWords.CACHE.predicate.push(word);
        }
      } else {
        if(!FunnyWords.CACHE.object.includes(word)) {
          FunnyWords.CACHE.object.push(word);
        }
      }
    });
    this.save();
  }

  public save() {
    Files.write(FunnyWords.cache_path, JSON.stringify(FunnyWords.CACHE, null, 2));
    Files.write(FunnyWords.message_db_path, JSON.stringify(FunnyWords.MESSAGE_DB, null, 2));
  }
}
