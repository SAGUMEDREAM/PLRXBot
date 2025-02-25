import {UserInfo} from "./UserInfo";
import {Constant} from "../Constant";
import path from "path";
import {Files} from "../utils/Files";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {BaseUserProfile} from "./BaseUserProfile";
import {botOptional, LOGGER} from "../../index";
import {Reloadable} from "../impl/Reloadable";

export class UserManager implements Reloadable {
  private static readonly INSTANCE = new UserManager();
  private userdata: Map<number | string, UserInfo> = new Map<number | string, UserInfo>();

  private constructor() {
  }

  public static getInstance() {
    return Constant.USER_MANAGER;
  }

  public static create(): UserManager {
    this.INSTANCE.load();
    return this.INSTANCE;
  }

  public load() {
    LOGGER.info("Loading UserManager...");
    // setInterval(() => {
    //   this.userdata.clear();
    // }, 3600000 / 2);
  }

  public async reload() {
    for (const userInfo of this.userdata.values()) {
      await userInfo.save();
    }
    this.userdata.clear();
  }

  public static async createUser(user_id: number): Promise<UserInfo>;
  public static async createUser(session: Session<User.Field, Channel.Field, Context>): Promise<UserInfo>;
  public static async createUser(arg: number | Session<User.Field, Channel.Field, Context>): Promise<UserInfo> {
    if (typeof arg === 'number') {
      const user: UserInfo = await UserInfo.getConstructor(arg);
      this.getInstance().userdata.set(arg, user);
      return user;
    } else {
      const user: UserInfo = await UserInfo.getConstructor(arg);
      this.getInstance().userdata.set(arg.event.user.id, user);
      return user;
    }
  }

  public static exists(user_id: number | string): boolean {
    return this.has(user_id) || Files.exists(path.resolve(this.getDataPath(), user_id + ".json"));
  }

  public static has(user_id: number | string): boolean {
    return this.getInstance().userdata.has(user_id) || Files.exists(path.resolve(this.getDataPath(), user_id + ".json"));
  }

  public static async get(session: Session<User.Field, Channel.Field, Context> | number | string): Promise<null | UserInfo>;
  public static async get(args: number | string | Session<User.Field, Channel.Field, Context>): Promise<null | UserInfo> {
    let user = null;

    if (typeof args === "number" || typeof args === "string") {
      user = this.getInstance().userdata.get(args.toString());
      if (!user) {
        user = await this.loadFromFile(args);
      }
    } else {
      const userId: string = args.userId.toString();
      user = this.getInstance().userdata.get(userId);
      if (!user) {
        user = await this.loadFromFile(userId);
      }
    }

    return user;
  }

  public static async getOrCreate(session: Session<User.Field, Channel.Field, Context> | number | string): Promise<null | UserInfo>;
  public static async getOrCreate(args: number | string | Session<User.Field, Channel.Field, Context>): Promise<UserInfo> {
    if (typeof args === 'number') {
      return await this.get(args) || UserManager.createUser(args);
    } else if (typeof args === 'string') {
      return await this.get(args) || UserManager.createUser(Number(args));
    } else {
      return await this.get(args) || UserManager.createUser(args);
    }
  }

  public static async getProfile(session: Session<User.Field, Channel.Field, Context> | number | string): Promise<null | BaseUserProfile>;
  public static async getProfile(args: number | string | Session<User.Field, Channel.Field, Context>): Promise<BaseUserProfile> {
    if (typeof args === 'number') {
      return (await this.get(args))?.profile || (await UserManager.createUser(args)).profile;
    } else if (typeof args === 'string') {
      return (await this.get(args))?.profile || (await UserManager.createUser(Number(args))).profile;
    } else {
      return (await this.get(args))?.profile || (await UserManager.createUser(args)).profile;
    }
  }

  public static async loadFromFile(args: number | string) {
    const userDataPath: string = UserManager.getDataPath();
    const dPath = path.resolve(userDataPath, (args.toString() + ".json"));
    if (Files.exists(dPath)) {
      const user_id = Files.getFileName(dPath);
      const user: UserInfo = await UserInfo.getConstructor(dPath);
      this.getInstance().userdata.set(user_id, user);
      return user;
    } else {
      return null;
    }
  }

  public static async hasPermissionLevel(session: Session<User.Field, Channel.Field, Context> | number | string, permissionLevel: number): Promise<boolean>;
  public static async hasPermissionLevel(args: number | string | Session<User.Field, Channel.Field, Context>, permissionLevel: number): Promise<boolean> {
    if (typeof args === "number" || typeof args === "string") {
      if (args == botOptional.value.selfId) return true;
      return (await this.get(args))?.profile?.permission_level >= permissionLevel;
    } else {
      if (args.userId == botOptional.value.selfId) return true;
      return (await this.get(args.userId.toString()))?.profile?.permission_level >= permissionLevel;
    }
  }

  public static async hasPermission(session: Session<User.Field, Channel.Field, Context> | number | string, permission: string): Promise<boolean>;
  public static async hasPermission(args: number | string | Session<User.Field, Channel.Field, Context>, permission: string): Promise<boolean> {
    if (typeof args === "number" || typeof args === "string") {
      if (args == botOptional.value.selfId) return true;
      return (await this.get(args))?.profile?.permissions.includes(permission);
    } else {
      if (args.userId == botOptional.value.selfId) return true;
      return (await this.get(args.userId.toString()))?.profile?.permissions.includes(permission);
    }
  }

  public static resetUserData(user_id: number | string): boolean {
    const userIdStr = user_id.toString();

    if (this.getInstance().userdata.has(userIdStr)) {
      this.getInstance().userdata.delete(userIdStr);
      const userDataPath = this.getFilePath(userIdStr);
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

  public getUserDataMap(): Map<number | string, UserInfo> {
    return this.userdata;
  }

  public static getDataPath() {
    return Constant.USER_DATA_PATH;
  }

  public static getFilePath(user_id: number | string): string {
    return path.resolve(this.getDataPath(), user_id + ".json");
  }

  public static init(): void {
  };
}
