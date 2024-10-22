import {Files} from "../utils/Files";
import {Constant} from "../Constant";

export class Config {
  private config: object;
  public constructor() {
    this.read();
  }
  public read() {
    if (Files.exists(Constant.CONFIG_FILE_PATH)) {
      this.config = JSON.parse(Files.read(Constant.CONFIG_FILE_PATH));
    }
  }
  public save() {
    Files.write(Constant.CONFIG_FILE_PATH, JSON.stringify(this.config, null, 2));
  }
  public getConfig() {
    return this.config;
  }
}
