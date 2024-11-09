import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {PluginEvent, PluginListener} from "../../core/plugins/Plugins";
import {MFFilters} from "./utils/MFFilters";
import {Files} from "../../core/utils/Files";
import {CommandManager} from "../../core/command/CommandManager";
import nodejieba from "nodejieba"

export class MessageForwarding extends PluginInitialization {
  constructor() {
    super("message_forwarding");
  }

  public load(): void {
    const cache = Files.read(MFFilters.cache_path);
    MFFilters.MFCache = JSON.parse(cache)["cache"] || [];
    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      if(CommandManager.getInstance().getProvider().has(session.content.split(' ')[0])) return;
      MFFilters.handle(session, args);
    });
  }
}
