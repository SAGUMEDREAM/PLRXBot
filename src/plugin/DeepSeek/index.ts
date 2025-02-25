import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {Config} from "../../core/data/Config";
import {CommandChat} from "./command/CommandChat";
import OpenAI from "openai";
import {CommandClearMessages} from "./command/CommandClearMessages";

export abstract class DeepSeekCfg {
  abstract key: string;
}

export class DeepSeek extends PluginInitialization {
  public static INSTANCE: PluginInitialization;
  public static BASE_URL = `https://api.deepseek.com`;
  public static API_KEY = ``
  public static OPEN_AI: OpenAI;
  public config: Config<DeepSeekCfg>;
  constructor() {
    super("deep_seek");
    DeepSeek.INSTANCE = this;
  }
  public load() {
    this.config = <Config<DeepSeekCfg>> Config.createConfig('deepseek', {
      key: ""
    });
    this.config.load();
    DeepSeek.API_KEY = this.config.getConfig().key;

    DeepSeek.OPEN_AI = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: DeepSeek.API_KEY
    });

    const instance = this.commandManager;
    instance.registerCommand(['/chat','/对话'], CommandChat.get());
    instance.registerCommand(['/clear_memory','/清理对话'], CommandClearMessages.get());
  }
}
