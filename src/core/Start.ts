import {Constant} from "./Constant";
import {Consoles} from "./network/Consoles";
import {Events} from "./event/Events";
import {LanguageTypes} from "./language/LanguageTypes";
import {LOGGER} from "../index";
import {Plugins} from "./plugins/Plugins";
import {CommandManager} from "./command/CommandManager";

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
}
