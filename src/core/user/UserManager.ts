import { UserProfile } from "./UserProfile";
import { Constant } from "../Constant";
import fs from "fs";
import path from "path";
import { Files } from "../utils/Files";
import { Context, Session } from "koishi";
import { Channel, User } from "@koishijs/core";
import * as cluster from "cluster";
import { BaseUserProfile } from "./BaseUserProfile";
import { GCUtils } from "../utils/GCUtils";
import {botInstance, LOGGER} from "../../index";
import {Reloadable} from "../impl/Reloadable";

export class UserManager implements Reloadable {
  private static readonly INSTANCE = new UserManager();
  private userdata: Map<number | string, UserProfile> = new Map<number | string, UserProfile>();

  private constructor() {}

  public static getInstance() {
    return Constant.USER_MANAGER;
  }

  public static create(): UserManager {
    this.INSTANCE.load();
    return this.INSTANCE;
  }

  public load() {
    LOGGER.info("Loading UserManager...");
    setInterval(() => {
      this.userdata.clear();
    }, 3600000 / 2);
  }

  public reload() {
    this.userdata.forEach(userInfo => userInfo.save());
    this.userdata.clear();
  }

  public static createUser(user_id: number): UserProfile;
  public static createUser(session: Session<User.Field, Channel.Field, Context>): UserProfile;
  public static createUser(arg: number | Session<User.Field, Channel.Field, Context>): UserProfile {
    if (typeof arg === 'number') {
      const user: UserProfile = new UserProfile(arg);
      this.getInstance().userdata.set(arg, user);
      return user;
    } else {
      const user: UserProfile = new UserProfile(arg);
      this.getInstance().userdata.set(arg.event.user.id, user);
      return user;
    }
  }

  public static getUserPath(user_id: number | string): string {
    return path.resolve(this.getUserDataPath(), user_id + ".json");
  }

  public static exists(user_id: number | string): boolean {
    return this.has(user_id) || Files.exists(path.resolve(this.getUserDataPath(), user_id + ".json"));
  }

  public static has(user_id: number | string): boolean {
    return this.getInstance().userdata.has(user_id) || Files.exists(path.resolve(this.getUserDataPath(), user_id + ".json"));
  }

  public static get(session: Session<User.Field, Channel.Field, Context> | number | string): null | UserProfile;
  public static get(args: number | string | Session<User.Field, Channel.Field, Context>): null | UserProfile {
    let userProfile = null;

    if (typeof args === "number" || typeof args === "string") {
      userProfile = this.getInstance().userdata.get(args.toString());
      if (!userProfile) {
        userProfile = this.loadPfFile(args);
      }
    } else {
      const userId = args.event.user.id.toString();
      userProfile = this.getInstance().userdata.get(userId);
      if (!userProfile) {
        userProfile = this.loadPfFile(userId);
      }
    }

    return userProfile;
  }

  public static getOrCreate(session: Session<User.Field, Channel.Field, Context> | number | string): null | UserProfile;
  public static getOrCreate(args: number | string | Session<User.Field, Channel.Field, Context>): UserProfile {
    if (typeof args === 'number') {
      return this.get(args) || UserManager.createUser(args);
    } else if (typeof args === 'string') {
      return this.get(args) || UserManager.createUser(Number(args));
    } else {
      return this.get(args) || UserManager.createUser(args);
    }
  }

  public static getProfile(session: Session<User.Field, Channel.Field, Context> | number | string): null | BaseUserProfile;
  public static getProfile(args: number | string | Session<User.Field, Channel.Field, Context>): BaseUserProfile {
    if (typeof args === 'number') {
      return this.get(args)?.profile || UserManager.createUser(args).profile;
    } else if (typeof args === 'string') {
      return this.get(args)?.profile || UserManager.createUser(Number(args)).profile;
    } else {
      return this.get(args)?.profile || UserManager.createUser(args).profile;
    }
  }
  public static loadPfFile(args: number | string) {
    const userDataPath: string = UserManager.getUserDataPath();
    const dPath = path.resolve(userDataPath, (args.toString() + ".json"));
    if (Files.exists(dPath)) {
      const user_id = Files.getFileName(dPath);
      const user: UserProfile = new UserProfile(dPath);
      this.getInstance().userdata.set(user_id, user);
      return user;
    } else {
      return null;
    }
  }

  public static hasPermissionLevel(session: Session<User.Field, Channel.Field, Context> | number | string, permissionLevel: number): boolean;
  public static hasPermissionLevel(args: number | string | Session<User.Field, Channel.Field, Context>, permissionLevel: number): boolean {
    if (typeof args === "number" || typeof args === "string") {
      if(args == botInstance.selfId) return true;
      return this.get(args)?.profile?.permission_level >= permissionLevel;
    } else {
      if(args.userId == botInstance.selfId) return true;
      return this.get(args.event.user.id.toString())?.profile?.permission_level >= permissionLevel;
    }
  }

  public static hasPermission(session: Session<User.Field, Channel.Field, Context> | number | string, permission: string): boolean;
  public static hasPermission(args: number | string | Session<User.Field, Channel.Field, Context>, permission: string): boolean {
    if (typeof args === "number" || typeof args === "string") {
      if(args == botInstance.selfId) return true;
      return this.get(args)?.profile?.permissions.includes(permission);
    } else {
      if(args.userId == botInstance.selfId) return true;
      return this.get(args.event.user.id.toString())?.profile?.permissions.includes(permission);
    }
  }
  public static resetUserData(user_id: number | string): boolean {
    const userIdStr = user_id.toString();

    if (this.getInstance().userdata.has(userIdStr)) {
      this.getInstance().userdata.delete(userIdStr);
      const userDataPath = this.getUserPath(userIdStr);
      if (Files.exists(userDataPath)) {
          Files.delete(userDataPath);
      }
      return true;
    } else {
      return false;
    }
  }

  public static unloadUserData(user_id: number | string): boolean {
    const userIdStr = user_id.toString();
    if (this.getInstance().userdata.has(userIdStr)) {
      this.getInstance().userdata.delete(userIdStr);
      return true;
    } else {
      return false;
    }
  }

  public getUserDataMap(): Map<number | string, UserProfile> {
    return this.userdata;
  }

  public static getUserDataPath() {
    return Constant.USER_DATA_PATH;
  }

  public static init(): void {};
}
