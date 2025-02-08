import {PluginInitialization} from "../PluginInitialization";
import {exec} from "child_process";
import os from "os";

export class KoishiLoader extends PluginInitialization {
  public static INSTANCE: KoishiLoader;
  constructor() {
    super("koishi_loader");
    KoishiLoader.INSTANCE = this;
  }

  public load(): void {
  }
}
