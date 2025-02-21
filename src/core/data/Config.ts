import {Files} from "../utils/Files";
import {LOGGER} from "../../index";
import path from "path";
import {Constant} from "../Constant";

export class Config<T extends object> {
  private readonly path: string;
  private config: T;
  private readonly defaultConfig: T;

  public constructor(path: string, defaultConfig: T, autoLoading = false) {
    this.path = path;
    this.config = defaultConfig;
    this.defaultConfig = defaultConfig;
    if (autoLoading) this.load();
  }

  public load() {
    if (Files.exists(this.path)) {
      try {
        const content = Files.read(this.path);
        this.config = JSON.parse(content);
      } catch (e) {
        LOGGER.error(`Can't loading config in ${this.path}`);
        LOGGER.error(e);
        this.setup();
      }
    } else {
      this.setup();
    }
  }

  public save() {
    Files.write(this.path, JSON.stringify(this.config, null, 2));
  }

  public setup() {
    this.config = this.defaultConfig;
    this.save();
  }

  public getConfig() {
    return this.config;
  }

  public static createConfig(name: string, object: object, autoLoading = false) {
    return new Config(path.join(Constant.DATA_PATH, `${name}.json`), object, autoLoading);
  }

  public static createCachesConfig(name: string, object: object, autoLoading = false) {
    return new Config(path.join(Constant.CACHES_PATH, `${name}.json`), object, autoLoading);
  }

}
