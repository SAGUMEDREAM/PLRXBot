import {PluginInitialization} from "./PluginInitialization";
import {PluginEvent} from "./PluginEvent";
import {PluginListener} from "./PluginListener";
import {PluginLoader} from "../../plugin/PluginLoader";
import {LOGGER} from "../../index";
import {CustomHandleEvents} from "./CustomHandleEvents";
import path from "path";
import {Utils} from "../utils/Utils";
import {Files} from "../utils/Files";
import {PluginInfo} from "./PluginInfo";
import {Start} from "../Start";
import {Constant} from "../Constant";


export class Plugins {
  private static PluginMap: Map<string, PluginInitialization> = new Map<string, PluginInitialization>();
  private static DisabledPluginId: string[] = [];

  public static init(): void {
  }

  public static register(Initialization: PluginInitialization) {
    try {
      this.PluginMap.set(Initialization.plugin_id, Initialization);
    } catch (e) {
      LOGGER.error(e)
    }
  }

  public static load() {
    CustomHandleEvents.registerCustomHandles();
    PluginLoader.load();
    let b = this.verify();
    if(!b) {
      Start.exit();
      throw new Error(`The plugin verification failed, 蓬莱人形Bot failed to start`);
    }
    this.PluginMap.forEach((initialization) => {
      try {
        initialization.load();
        initialization.pluginLogger.info("Loading Complete");
      } catch (err) {
        initialization.pluginLogger.error("Can't loading plugin cause: ");
        initialization.pluginLogger.error(err);
      }
    });
    LOGGER.info("Loading Plugin Complete");
  }

  public static verify(): boolean {
    try {
      const pluginList: string[] = [];
      const pluginDepends: Record<string, string[]> = {};
      this.PluginMap.forEach((initialization, plugin_id, map) => {
        const config_path = path.join(Utils.getRoot(), 'plugin', `${initialization.plugin_id}.json`);
        try {
          const parse: PluginInfo = JSON.parse(Files.read(config_path)) as PluginInfo;
          initialization.pluginConfig = parse;
          pluginList.push(initialization.plugin_id);
          pluginDepends[initialization.plugin_id] = parse.depends || [];

          // if (parse.environment == "typescript" && Constant.NODEJS_TYPESCRIPT_ENVIRONMENT == false) {
          //   LOGGER.warn(
          //     `${initialization.plugin_id} needs to run in a pure TypeScript environment, but your environment may cause errors in the plugin.`
          //   );
          // } else if (parse.environment == "javascript" && Constant.NODEJS_TYPESCRIPT_ENVIRONMENT == true) {
          //   LOGGER.warn(
          //     `${initialization.plugin_id} needs to run in a pure JavaScript environment, but your environment may cause errors in the plugin.`
          //   );
          // }
        } catch (error) {
          LOGGER.error(`Unable to read plugin configuration file ${config_path}`);
          LOGGER.error(error);
          map.delete(plugin_id);
        }
      });

      const missingDependencies: string[] = [];
      for (const pluginId in pluginDepends) {
        for (const dep of pluginDepends[pluginId]) {
          if (!pluginList.includes(dep)) {
            LOGGER.error(`Plugin ${pluginId} requires dependency ${dep}, but it is not installed!`);
            missingDependencies.push(dep);
          }
        }
      }

      if (missingDependencies.length > 0) {
        throw new Error(`Missing dependency of plugin ${[...new Set(missingDependencies)].join(', ')} detected`)
      }

      return true;
    } catch (err) {
      LOGGER.error(err);
      return false;
    }
  }

  public static loadPluginConfig(initialization: PluginInitialization) {

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

  public static getPlugins() {
    return this.PluginMap;
  }
}
