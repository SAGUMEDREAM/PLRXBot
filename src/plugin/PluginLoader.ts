import {LOGGER} from "../index";
import {Plugins} from "../core/plugins/Plugins";
import {Gensokyo} from "./Gensokyo";
import {MessageForwarding} from "./MessageForwarding";
import {FunnyWords} from "./FunnyWords";
import {EssentialBot} from "./EssentialBot";
import {DailyEvent} from "./DailyEvent";
import {MaiMaiDX} from "./MaiMaiDX";
import {Shrine} from "./Shrine";
import {OtomadHelper} from "./OtomadHelper";
import {OwlPenguinParrot} from "./OwlPenguinParrot";
import {DeepSeek} from "./DeepSeek";
import {PythonSupport} from "../core/plugins/base/PythonSupport";
import {KoishiLoader} from "../core/plugins/base/KoishiLoader";
import {KoishiCore} from "../core/plugins/base/KoishiCore";

export class PluginLoader {
  public static load() {
    LOGGER.info("Loading Plugins...");
    Plugins.register(new KoishiCore());
    Plugins.register(new KoishiLoader());
    Plugins.register(new PythonSupport());

    Plugins.register(new MessageForwarding());
    Plugins.register(new Gensokyo());
    Plugins.register(new EssentialBot());
    // Plugins.register(new DailyEvent());
    Plugins.register(new MaiMaiDX());
    Plugins.register(new FunnyWords());
    Plugins.register(new Shrine());
    Plugins.register(new OtomadHelper());
    Plugins.register(new OwlPenguinParrot());
    Plugins.register(new DeepSeek());
    /*const path: string = Constant.PLUGIN_PATH;
    const files = Files.getDir(path);
    files.forEach((fileDir: string) => {
      const files = Files.getFileName(fileDir+"\\index.ts");
    });*/
  }
}
