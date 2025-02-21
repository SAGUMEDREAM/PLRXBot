import {PluginInitialization} from "../PluginInitialization";

export class KoishiLoader extends PluginInitialization {
  public static INSTANCE: KoishiLoader;
  constructor() {
    super("koishi_loader");
    KoishiLoader.INSTANCE = this;
  }

  public load(): void {
  }
}
