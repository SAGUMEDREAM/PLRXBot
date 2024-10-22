import * as satori from "@satorijs/core";
import {Channel, User} from "@koishijs/core";
import {Context, Field} from "koishi";
import { Session } from "koishi";

declare module "@koishijs/core" {
  interface Session<U extends User.Field = never, G extends Channel.Field = never, C extends Context = Context> {
    hasPermission: (permission: any) => boolean;
    hasPermissionLevel: (permissionLevel: any) => boolean;
    hasGroupPermission: (permission: any) => boolean;
  }
  interface Session<U extends User.Field = never, G extends Channel.Field = never, C extends Context = Context> extends satori.Session<C> {
    hasPermission: (permission: any) => boolean;
    hasPermissionLevel: (permissionLevel: any) => boolean;
    hasGroupPermission: (permission: any) => boolean;
  }
  class Session<C extends Context = Context> {
    hasPermission: (permission: any) => boolean;
    hasPermissionLevel: (permissionLevel: any) => boolean;
    hasGroupPermission: (permission: any) => boolean;
  }
  interface Session {
    hasPermission: (permission: any) => boolean;
    hasPermissionLevel: (permissionLevel: any) => boolean;
    hasGroupPermission: (permission: any) => boolean;
    isGroupAdmin: (permission: any) => boolean;
  }
}

declare module 'sync-request' {
  interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    json?: any;
    body?: string;
  }

  function request(method: string, url: string, options?: RequestOptions): { body: string };
  export default request;
}

