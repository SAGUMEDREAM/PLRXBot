import {PluginInitialization} from "../PluginInitialization";

export class KoishiCore extends PluginInitialization {
  public static INSTANCE: KoishiCore;
  constructor() {
    super("koishi_core");
    KoishiCore.INSTANCE = this;
  }

  public load(): void {
  }
}
