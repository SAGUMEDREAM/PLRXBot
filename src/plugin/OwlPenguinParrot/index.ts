import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {PluginListener} from "../../core/plugins/PluginListener";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {Messages} from "../../core/network/Messages";


export class OwlPenguinParrot extends PluginInitialization {
  constructor() {
    super("owl_penguin_parrot");
  }
  public load(): void {
    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      const content = session.content
      if(content.toLowerCase().startsWith('owlpenguinparrot')) {
        Messages.sendMessage(session, '干什么');
      }
    })
  }
}
