import {LOGGER} from "../index";
import {Plugins} from "../core/plugins/Plugins";
import {Inventories} from "./Inventories";
import {MessageForwarding} from "./MessageForwarding";
import {FunnyWords} from "./FunnyWords";
import {EssentialBot} from "./EssentialBot";

export class PluginLoader {
  public static load() {
    LOGGER.info("Loading Plugins...");
    Plugins.register(new MessageForwarding());
    Plugins.register(new Inventories());
    Plugins.register(new EssentialBot());
    // Plugins.register(new FunnyWords());
    /*const path: string = Constant.PLUGIN_PATH;
    const files = Files.getDir(path);
    files.forEach((fileDir: string) => {
      const files = Files.getFileName(fileDir+"\\index.ts");
    });*/
  }
}
