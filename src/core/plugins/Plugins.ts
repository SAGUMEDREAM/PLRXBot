import {PluginInitialization} from "./PluginInitialization";
import {PluginEvent} from "./PluginEvent";
import {PluginListener} from "./PluginListener";
import {PluginLoader} from "../../plugin/PluginLoader";
import {LOGGER} from "../../index";


export class Plugins {
  private static PluginMap: Map<string, PluginInitialization> = new Map<string, PluginInitialization>();
  private static DisabledPluginId: string[] = [];

  public static init(): void {}

  public static register(Initialization: PluginInitialization) {
    try {this.PluginMap.set(Initialization.plugin_id, Initialization);} catch (e) {LOGGER.error(e)}
  }

  public static load() {
    PluginLoader.load();
    this.PluginMap.forEach((initialization) => {
      initialization.load();
      initialization.pluginLogger.info("Loading Complete")
    });
    LOGGER.info("Loading Plugin Complete");
  }

  public static enable(pluginId: string) {
    const index = this.DisabledPluginId.indexOf(pluginId);
    if (index !== -1) {
      this.DisabledPluginId.splice(index, 1);
      PluginListener.emit(PluginEvent.PLUGIN_ENABLED, null, pluginId);
    }
  }

  public static disable(pluginId: string) {
    if (this.PluginMap.has(pluginId)) {
      this.DisabledPluginId.push(pluginId);
      PluginListener.emit(PluginEvent.PLUGIN_DISABLED, null, pluginId);
    }
  }
  public static isEnabled(pluginId: string): boolean {
    return this.PluginMap.has(pluginId);
  }
  public static isDisabled(pluginId: string): boolean {
    return this.DisabledPluginId.includes(pluginId);
  }
}
