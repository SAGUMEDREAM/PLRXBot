import { createServer, Server } from "http";
import express, {Express, Request} from "express";
import { Logger } from "koishi";
import {Results} from "./Results";
import {applyHooks} from "../../index";

export class KoishiServer {
  public static INSTANCE: KoishiServer;
  public readonly LOGGER: Logger = new Logger("@kisin-reimu/server");
  private app: Express = express();
  private server: Server;
  private port = 5595;

  protected constructor() {
    this.initRoutes();
    this.server = createServer(this.app);
    this.listener();
  }

  public static getServer(): KoishiServer {
    if (!this.INSTANCE) {
      this.INSTANCE = new KoishiServer();
    }
    return this.INSTANCE;
  }

  /**
   * 处理 HTTP 路由
   */
  protected initRoutes() {
    this.app.get("/", (req, res) => {
      res.send("Hello, Koishi Server!");
    });

    this.app.get("/status", (req, res) => {
      res.json(Results.success({ status: "running" }));
    });

    this.app.get("/api/send_message", (req, res) => {
      const params = KoishiServer.getParams(req);
      const user_id = "chatapi_" + params["user_id"];
      const channel_id = params["channel_id"];
      const content = params["content"];

    });

    this.LOGGER.info("Routes initialized.");
  }

  /**
   * 获取请求参数对象
   */
  public static getParams(req: Request): object {
    return {
      ...req.query,
      ...req.params,
      ...req.body,
    };
  }

  /**
   * 监听 HTTP 请求
   */
  public listener() {
    this.LOGGER.info("Listener started.");
  }

  /**
   * 重新加载服务器
   */
  public reload() {
    this.close();
    this.open();
  }

  /**
   * 开启服务器
   */
  public open() {
    this.server = this.server || createServer(this.app);
    this.server.listen(this.port, () => {
      this.LOGGER.info(`Server is running on port ${this.port}`);
    });
  }

  /**
   * 关闭服务器
   */
  public close() {
    if (this.server) {
      this.server.close(() => {
        this.LOGGER.info(`Server closed on port ${this.port}`);
      });
    }
  }
}
