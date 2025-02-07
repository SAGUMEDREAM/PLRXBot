import {PluginEvent} from "./PluginEvent";
import {PluginInitialization} from "./PluginInitialization";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {DisabledGroupList} from "../config/DisabledGroupList";
import {Plugins} from "./Plugins";


export type PluginListenerFunction = (session: Session<User.Field, Channel.Field, Context>, ...args: any[]) => void;
export type PluginEventListener = { pluginId?: string; listener: PluginListenerFunction };
export class PluginListener {
  public static readonly Events: Map<PluginEvent, PluginEventListener[]> = new Map<PluginEvent, PluginEventListener[]>();

  public static on(event: PluginEvent, pluginId: string | PluginInitialization, listener: PluginListenerFunction): void {
    let arg: string;

    if (pluginId instanceof PluginInitialization) {
      arg = pluginId.plugin_id;
    } else {
      arg = pluginId;
    }

    const listeners = this.Events.get(event) || [];
    listeners.push({pluginId: arg, listener});
    this.Events.set(event, listeners);
  }

  public static onEnable(pluginId: string | PluginInitialization, listener: PluginListenerFunction) {
    this.on(PluginEvent.PLUGIN_ENABLED, pluginId, listener);
  }

  public static onDisable(pluginId: string | PluginInitialization, listener: PluginListenerFunction) {
    this.on(PluginEvent.PLUGIN_DISABLED, pluginId, listener);
  }

  public static emit(event: PluginEvent, session?: Session<User.Field, Channel.Field, Context>, ...args: any[]): void {
    if (session && DisabledGroupList.getInstance().getConfigInstance().getConfig().list.includes(session?.event?.channel?.id)) {
      return;
    }
    const listeners = this.Events.get(event);
    if (listeners) {
      listeners.forEach(({pluginId, listener}) => {
        if (!Plugins.isDisabled(pluginId)) {
          listener(session, ...args);
        }
      });
    }
  }

  public static cancel() {
    throw null;
  }
}
