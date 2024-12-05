import {LOGGER} from "../index";
import {Plugins} from "../core/plugins/Plugins";
import {Inventories} from "./Inventories";
import {MessageForwarding} from "./MessageForwarding";
import {FunnyWords} from "./FunnyWords";
import {EssentialBot} from "./EssentialBot";
import {DailyEvent} from "./DailyEvent";
import {MaiMaiDX} from "./MaiMaiDX";
import {Shrine} from "./shrine";
import {OtomadHelper} from "./OtomadHelper";

export class PluginLoader {
  public static load() {
    LOGGER.info("Loading Plugins...");
    Plugins.register(new MessageForwarding());
    Plugins.register(new Inventories());
    Plugins.register(new EssentialBot());
    Plugins.register(new DailyEvent());
    Plugins.register(new MaiMaiDX());
    Plugins.register(new FunnyWords());
    Plugins.register(new Shrine());
    Plugins.register(new OtomadHelper());
    /*const path: string = Constant.PLUGIN_PATH;
    const files = Files.getDir(path);
    files.forEach((fileDir: string) => {
      const files = Files.getFileName(fileDir+"\\index.ts");
    });*/
  }
}
