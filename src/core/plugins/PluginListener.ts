import {PluginEvent} from "./PluginEvent";
import {PluginInitialization} from "./PluginInitialization";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {DisabledGroupList} from "../config/DisabledGroupList";
import {Plugins} from "./Plugins";
import {BotList} from "../config/BotList";
import {UserManager} from "../user/UserManager";
import {UserInfo} from "../user/UserInfo";
import {GroupInfo} from "../group/GroupInfo";
import {GroupManager} from "../group/GroupManager";


export type PluginListenerFunction =
  | ((session: Session<User.Field, Channel.Field, Context>, args: ListenerArgs, context: ListenerContext) => void)
  | ((session: Session<User.Field, Channel.Field, Context>, args: ListenerArgs, context: ListenerContext) => Promise<void>);
export type PluginEventListener = {
  rawId?: number;
  pluginId?: string;
  listener: PluginListenerFunction;
  platform: string;
  enabled: boolean;
};

export class ListenerArgs {
  private props: Map<string, any>;

  constructor(props?: Map<string, any>) {
    if (props == null) {
      props = new Map<string, any>();
    }
    this.props = props;
  }

  public append(key: string, value: any): ListenerArgs {
    this.props.set(key, value);
    return this;
  }

  public has(key: string): boolean {
    return this.props.has(key);
  }

  public get(key: string): any {
    return this.props.get(key);
  }

  public static create(props?: Map<string, any>) {
    return new ListenerArgs(props);
  }

}

export enum ContextResults {
  CANCEL, // 继续执行
  PASS,   // 跳过当前触发事件
  NEXT,   // 继续事件
}

export class ListenerContext {
  protected state: ContextResults = ContextResults.NEXT;

  public next(): void {
    this.state = ContextResults.NEXT
  }

  public pass(): void {
    this.state = ContextResults.PASS;
  }

  public cancel(): void {
    this.state = ContextResults.CANCEL;
  }

  public isNext(): boolean {
    return this.state == ContextResults.NEXT;
  }

  public isPass(): boolean {
    return this.state == ContextResults.PASS;
  }

  public isCancel(): boolean {
    return this.state == ContextResults.CANCEL;
  }
}

export class PluginListener {
  public static readonly Events: Map<PluginEvent, PluginEventListener[]> = new Map<PluginEvent, PluginEventListener[]>();
  public static readonly KoishiDefault: string = 'koishi'

  public static on(event: PluginEvent, optionalArgs1: string | PluginInitialization, listener: PluginListenerFunction, platform: string = "common"): void {
    let arg: string;

    if (optionalArgs1 instanceof PluginInitialization) {
      arg = optionalArgs1.plugin_id;
    } else if (typeof optionalArgs1 == "string") {
      arg = optionalArgs1;
    } else {
      arg = PluginListener.KoishiDefault;
    }

    const listeners = this.Events.get(event) || [];
    const instance = {
      rawId: listeners.length,
      pluginId: arg,
      listener: listener,
      platform: platform,
      enabled: true
    };
    listeners.push(instance);
    this.Events.set(event, listeners);
  }

  public static onEnable(pluginId: string | PluginInitialization, listener: PluginListenerFunction) {
    this.on(PluginEvent.PLUGIN_ENABLED, pluginId, listener);
  }

  public static onDisable(pluginId: string | PluginInitialization, listener: PluginListenerFunction) {
    this.on(PluginEvent.PLUGIN_DISABLED, pluginId, listener);
  }

  public static async emit(event: PluginEvent, session: Session<User.Field, Channel.Field, Context> | null, args: ListenerArgs): Promise<ListenerContext> {
    const context: ListenerContext = new ListenerContext();
    const listeners: PluginEventListener[] = this.Events.get(event);
    if (session != null) {
      const user: UserInfo = await UserManager.get(session);
      const group: GroupInfo = await GroupManager.get(session);
      if (user != null && user.profile.banned == true) {
        context.cancel();
        return context;
      }
      if (group != null && group.groupData.banned == true) {
        context.cancel();
        return context;
      }
      if (BotList.getInstance().getConfigInstance().getConfig().list.includes(String(session?.userId))) {
        context.cancel();
        return context;
      }
      if (DisabledGroupList.getInstance().getConfigInstance().getConfig().list.includes(session?.channelId)) {
        context.cancel();
        return context;
      }
    }
    if (listeners) {
      for (const listener of listeners) {
        const pluginId: string = listener.pluginId;
        const listenerFunction: PluginListenerFunction = listener.listener;
        if (!Plugins.isDisabled(pluginId)) {
          const isEnabled: boolean = listener.enabled;
          if (!isEnabled) {
            context.cancel();
            return context;
          }
          if (session != null) {
            const isCommon: boolean = listener.platform == "common";
            const isPlatform: boolean = session.platform == listener.platform;
            if(!isCommon) {
              if(!isPlatform) {
                context.cancel();
                return context;
              }
            }
          }
          const isAsync: boolean = listenerFunction.constructor.name == "AsyncFunction" || listenerFunction.constructor.name == "GeneratorFunction";
          if (isAsync) {
            await listenerFunction(session, args, context);
          } else {
            listenerFunction(session, args, context);
          }
          if (context.isCancel() == true) {
            return context;
          } else if (context.isPass()) {
            break;
          }
        }
      }
    }
    return context;
  }
}
