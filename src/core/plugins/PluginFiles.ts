import {LOGGER} from "../../index";
import {Plugins} from "./Plugins";
import {MessageForwarding} from "../../plugin/MessageForwarding";
import {EssentialsM} from "../../plugin/EssentialsM";
import {Inventories} from "../../plugin/Inventories";
import {FunnyWords} from "../../plugin/FunnyWords";


export class PluginFiles {
  public static load() {
    LOGGER.info("Loading Plugins...");
    Plugins.register(new MessageForwarding());
    Plugins.register(new Inventories());
    Plugins.register(new EssentialsM());
    Plugins.register(new FunnyWords());
    /*const path: string = Constant.PLUGIN_PATH;
    const files = Files.getDir(path);
    files.forEach((fileDir: string) => {
      const files = Files.getFileName(fileDir+"\\index.ts");
    });*/
  }
}
