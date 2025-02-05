import {Constant} from "./Constant";
import {Consoles} from "./network/Consoles";
import {Events} from "./event/Events";
import {LanguageTypes} from "./language/LanguageTypes";
import {LOGGER} from "../index";
import {Plugins} from "./plugins/Plugins";
import {PluginInitialization} from "./plugins/PluginInitialization";

export class Start {

  public static main(args?: string[]): void {
    LOGGER.info("==================================================")
    LOGGER.info("Loading @kisin-reimu/bot...")
    Constant.init();
    LanguageTypes.init();
    Events.init();
    Consoles.main();
    Plugins.load();
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
      Constant.USER_MANAGER.reload();
      Constant.GROUP_MANAGER.reload();
      LOGGER.info("Plugin is reloading");
    } catch (err) {
      LOGGER.error(err);
    } finally {
      this.main(args);
      LOGGER.info("Plugin reload completed");
    }
  }
}
