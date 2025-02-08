import {Constant} from "./Constant";
import {Consoles} from "./network/Consoles";
import {Events} from "./event/Events";
import {LanguageTypes} from "./language/LanguageTypes";
import {LOGGER} from "../index";
import {Plugins} from "./plugins/Plugins";
import {PluginInitialization} from "./plugins/PluginInitialization";
import {PluginListener} from "./plugins/PluginListener";
import {BotList} from "./config/BotList";
import {DisabledGroupList} from "./config/DisabledGroupList";

export class Start {

  public static main(args?: string[]): void {
    const startTime = Date.now();
    LOGGER.info("==================================================")
    LOGGER.info("Loading @kisin-reimu/bot...")
    Constant.init();
    LanguageTypes.init();
    Events.init();
    Consoles.main();
    Plugins.load();
    const endTime = Date.now();
    const startupTime = endTime - startTime;
    LOGGER.info(`Koishi framework took ${startupTime}ms to load "蓬莱人形Bot" plugin`)
    LOGGER.info("==================================================");
  }

  public static async reload(args?: string[]): Promise<void> {
    try {
      Plugins.getPlugins().forEach((initialization: PluginInitialization) => {
        initialization.pluginLogger.info("Uninstalling plugin...");
        try {
          if (typeof initialization["reload"] === "function") {
            initialization["reload"]();
          }
        } catch (err) {
          initialization.pluginLogger.error(err)
        }
      });
      Plugins.getPlugins().clear();
      PluginListener.Events.forEach((listener, event, events) => (listener.length = 0));
      Constant.USER_MANAGER.reload();
      Constant.GROUP_MANAGER.reload();
      BotList.getInstance().reload();
      DisabledGroupList.getInstance().reload();
      LOGGER.info("Plugin is reloading");
    } catch (err) {
      LOGGER.error(err);
    } finally {
      this.main(args);
      LOGGER.info("Plugin reload completed");
    }
  }
  public static exit(args?: string[]): void {
    LOGGER.warn("The plugin main thread exits");
  }
}
