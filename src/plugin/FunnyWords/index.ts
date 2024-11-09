import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandWeirdSay} from "./command/CommandWeirdSay";
import {Files} from "../../core/utils/Files";
import path from "path";
import {Utils} from "../../core/utils/Utils";
import {PluginEvent, PluginListener} from "../../core/plugins/Plugins";
import nodejieba from "nodejieba";

export class FunnyWords extends PluginInitialization {
  constructor() {
    super("funny_words");
  }
  public static readonly cache_path = path.resolve(path.join(Utils.getRoot(), 'data', 'caches'), "funny_words_cache.json");
  public static CACHE = {
    subject: [],
    predicate: [],
    object: []
  }
  public load(): void {
    const instance = CommandManager.getInstance();
    instance.registerCommand("/说怪话", CommandWeirdSay.get());

    const cache = Files.read(FunnyWords.cache_path);
    FunnyWords.CACHE = JSON.parse(cache) || {
      subject: [],
      predicate: [],
      object: []
    };
    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      if(CommandManager.getInstance().getProvider().has(session.content.split(' ')[0])) return;
      this.parse(session.content);
    });
    this.saveCache();
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
    this.saveCache();
  }
  public saveCache() {
    Files.write(FunnyWords.cache_path, JSON.stringify(FunnyWords.CACHE, null, 2));
  }
  public loadCache() {
    const cache = Files.read(FunnyWords.cache_path);
    if(cache) {
      FunnyWords.CACHE = JSON.parse(cache) || {
        subject: [],
        predicate: [],
        object: []
      };
    }
  }
}
