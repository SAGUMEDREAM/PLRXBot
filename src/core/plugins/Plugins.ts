import { PluginInitialization } from "./PluginInitialization";
import { PluginFiles } from "./PluginFiles";
import { Context, Session } from "koishi";
import { Channel, User } from "@koishijs/core";

type PluginListenerFunction = (session: Session<User.Field, Channel.Field, Context>, ...args: any[]) => void;

export enum PluginEvent {
  HANDLE_MESSAGE,             // 接收消息
  HANDLE_MESSAGE_BEFORE,      // 接收消息之前
  HANDLE_MESSAGE_AFTER,       // 接收消息之后
  LOADING_PROFILE,            // 加载用户数据
  LOADING_GROUP_DATA,         // 加载群组数据
  SAVING_PROFILE,             // 保存用户数据
  SAVING_GROUP_DATA,          // 保存群组数据
  REQUEST_FRIEND,             // 收到申请好友
  INVITED_TO_GROUP,           // 收到邀请加群
  BOT_JOIN_GROUP,             // 机器人账号加入群组
  MEMBER_JOIN_GROUP,         // 新成员加入群组
  MEMBER_REQUEST_JOIN_GROUP, // 收到加群请求
  PLUGIN_ENABLED,            // 插件加载
  PLUGIN_DISABLED,           // 插件卸载
}

type PluginEventListener = { pluginId?: string; listener: PluginListenerFunction };

export class PluginListener {
  public static Events: Map<PluginEvent, PluginEventListener[]> = new Map<PluginEvent, PluginEventListener[]>();

  public static on(event: PluginEvent, pluginId: string | PluginInitialization, listener: PluginListenerFunction): void {
    let arg: string;

    if (pluginId instanceof PluginInitialization) {
      arg = pluginId.plugin_id;
    } else {
      arg = pluginId;
    }

    const listeners = this.Events.get(event) || [];
    listeners.push({ pluginId: arg, listener });
    this.Events.set(event, listeners);
  }

  public static emit(event: PluginEvent, session?: Session<User.Field, Channel.Field, Context>, ...args: any[]): void {
    const listeners = this.Events.get(event);
    if (listeners) {
      listeners.forEach(({ pluginId, listener }) => {
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

export class Plugins {
  private static PluginMap: Map<string, PluginInitialization> = new Map<string, PluginInitialization>();
  private static DisabledPluginId: string[] = [];

  public static init(): void {}

  public static register(Initialization: PluginInitialization) {
    try {this.PluginMap.set(Initialization.plugin_id, Initialization);} catch (e) {}
  }

  public static load() {
    PluginFiles.load();
    this.PluginMap.forEach((Initialization) => {
      Initialization.load();
    });
  }

  public static enable(pluginId: string) {
    const index = this.DisabledPluginId.indexOf(pluginId);
    if (index !== -1) {
      this.DisabledPluginId.splice(index, 1);
      PluginListener.emit(PluginEvent.PLUGIN_ENABLED, null, pluginId);
    }
  }

  public static disable(pluginId: string) {
    if (this.PluginMap.has(pluginId)) {
      this.DisabledPluginId.push(pluginId);
      PluginListener.emit(PluginEvent.PLUGIN_DISABLED, null, pluginId);
    }
  }

  public static isDisabled(pluginId: string): boolean {
    return this.DisabledPluginId.includes(pluginId);
  }
}
