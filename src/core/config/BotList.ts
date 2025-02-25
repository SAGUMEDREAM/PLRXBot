import {Config} from "../data/Config";
import {Reloadable} from "../impl/Reloadable";

export interface BotListImpl {
  list: string[];
}

export class BotList implements Reloadable {
  private static INSTANCE: BotList;
  private config: Config<BotListImpl>;

  private constructor() {
    this.config = <Config<BotListImpl>>Config.createConfig("bot_list", {list: []});
  }

  public static getInstance(): BotList {
    if (!this.INSTANCE) {
      this.INSTANCE = new BotList();
    }
    return this.INSTANCE;
  }

  public async reload(): Promise<void> {
    this.config = <Config<BotListImpl>>Config.createConfig("bot_list", {list: []});
  }

  public getConfigInstance(): Config<BotListImpl> {
    return this.config;
  }
}
