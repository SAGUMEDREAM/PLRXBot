import {Logger} from "koishi";
import {PluginInfo} from "./PluginInfo";

export abstract class PluginInitialization {
  public plugin_name: string;
  public readonly plugin_id: string;
  public readonly pluginLogger: Logger;
  public pluginConfig: PluginInfo;
  public static INSTANCE: PluginInitialization;

  protected constructor(plugin_id: string) {
    this.plugin_id = plugin_id;
    this.pluginLogger  = new Logger(`@kisin-reimu/bot_plugin/${this.plugin_id}`);
  }

  public abstract load(): void;
}
