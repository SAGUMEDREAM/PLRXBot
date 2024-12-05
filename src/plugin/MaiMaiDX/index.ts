import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";

export class MaiMaiDX extends PluginInitialization {
  constructor() {
    super("maimai_dx");
  }
  public load() {
    let instance = CommandManager.getInstance();
    // instance.registerCommand(["b50"],null)
  }
}
