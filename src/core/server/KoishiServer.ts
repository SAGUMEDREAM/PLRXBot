import {createServer} from "http";
import {Logger} from "koishi";

export class KoishiServer {
  public static INSTANCE: KoishiServer;
  public readonly LOGGER: Logger = new Logger("@kisin-reimu/server");
  protected server = createServer();
  protected port = 5595;

  protected constructor() {
    this.init();
  }

  public static getServer(): KoishiServer {
    if (this.INSTANCE == null) {
      this.INSTANCE = new KoishiServer();
    }
    return this.INSTANCE;
  }

  public init() {
    this.LOGGER.info(`Server loading completed`);
  }

  public reload() {
    this.close();
    this.open();
  }

  public open() {
    this.LOGGER.info(`The server listens on port ${this.port}`);
    this.server.listen(this.port);
  }

  public close() {
    this.LOGGER.info(`Server closed on port ${this.port}`);
    this.server.close();
  }
}
