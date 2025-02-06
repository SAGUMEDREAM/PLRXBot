import {Files} from "../utils/Files";
import {LOGGER} from "../../index";
import path from "path";
import {Utils} from "../utils/Utils";

export class Config<T extends object> {
  private readonly path: string;
  private config: T;
  private readonly defaultConfig: T;

  public constructor(path: string, defaultConfig: T) {
    this.path = path;
    this.config = defaultConfig;
    this.defaultConfig = defaultConfig;
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

  public static createConfig(name: string, object: object) {
    return new Config(path.join(Utils.getRoot(), 'data', `${name}.json`), object);
  }
}
