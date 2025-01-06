import {Logger} from "koishi";

export abstract class PluginInitialization {
  public plugin_id: string;
  public pluginLogger: Logger;
  public static onlyInstance: PluginInitialization;

  protected constructor(plugin_id: string) {
    this.plugin_id = plugin_id;
    this.pluginLogger  = new Logger(`@kisin-reimu/bot_plugin/${this.plugin_id}`);
  }

  public abstract load(): void;
}
