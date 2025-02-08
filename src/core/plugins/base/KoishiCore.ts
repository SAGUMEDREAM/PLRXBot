import {PluginInitialization} from "../PluginInitialization";
import {exec} from "child_process";
import os from "os";

export class KoishiCore extends PluginInitialization {
  public static INSTANCE: KoishiCore;
  constructor() {
    super("koishi_core");
    KoishiCore.INSTANCE = this;
  }

  public load(): void {
  }
}
