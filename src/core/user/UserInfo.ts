import {Files} from "../utils/Files";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {BaseUserProfile} from "./BaseUserProfile";
import {UserManager} from "./UserManager";
import {DataFixerBuilder} from "../data/DataFixerBuilder";
import {PluginEvent} from "../plugins/PluginEvent";
import {ListenerArgs, PluginListener} from "../plugins/PluginListener";
import {botOptional} from "../../index";

export class UserInfo {
  public arg: any;
  public profile: BaseUserProfile;
  public path: string;
  public static dataFixer: DataFixerBuilder = DataFixerBuilder.createBuilder("user_profile")
    .createDataKey("next_message", {"open": false, "message": null, "state": 0})
    .build();

  protected constructor(path: string);
  protected constructor(user_id: number);
  protected constructor(session: Session<User.Field, Channel.Field, Context>);
  protected constructor(arg: string | number | Session<User.Field, Channel.Field, Context>) {
    this.arg = arg;
  }

  public static async getConstructor(arg: any): Promise<UserInfo> {
    const user = new UserInfo(arg);
    await user.init();
    return user;
  }

  private async init() {
    const arg = this.arg;
    if (typeof arg == 'string') {
      this.path = arg;
    } else if (typeof arg == 'number') {
      this.profile = {
        username: null,
        user_id: arg,
        user_avatar: null,
        banned: false,
        permission_level: 1,
        permissions: [],
        data: {}
      };
      this.path = UserManager.getFilePath(arg);
      await this.save();
    } else {
      this.profile = {
        username: arg.event.user.name,
        user_id: arg.event.user.id,
        user_avatar: arg.event.user.avatar,
        banned: false,
        permission_level: 1,
        permissions: [],
        data: {}
      };
      this.path = UserManager.getFilePath(arg.event.user.id);
      await this.save();
    }
    await this.load();
    await this.save();
    return this;
  }

  public custom(fields: any, ...arg: any[]) {
    this[fields](...arg);
  }

  public setCustom(target: any, fields: any) {
    this[target] = fields;
  }

  public getCustom(fields: any) {
    return this[fields] != null ? this[fields] : null;
  }

  private async load(): Promise<void> {
    if (Files.exists(this.path)) {
      this.profile = JSON.parse(Files.read(this.path));
    } else {
      this.profile = {
        username: null,
        user_id: Files.getFileName(this.path),
        user_avatar: null,
        banned: false,
        permission_level: 1,
        permissions: [],
        data: {}
      };
    }
    await PluginListener.emit(PluginEvent.LOADING_PROFILE, null, ListenerArgs.create().append("user", this));
    this.dataFixer();
  }

  public dataFixer(): void {
    if (!UserInfo.dataFixer.isConfirm()) {
      throw new Error("No data-fixer has been built");
    }
    for (const [key, fixer] of UserInfo.dataFixer.all()) {
      fixer.verify(this.profile.data);
    }
  }

  public hasPermission(permissions: string): boolean {
    if (this.profile.user_id == botOptional.value?.selfId) return true;
    return this.profile.permissions.includes(permissions);
  }

  public hasPermissionLevel(permission_level: number): boolean {
    if (this.profile.user_id == botOptional.value?.selfId) return true;
    return this.profile.permission_level >= permission_level;
  }

  public getProfile(): BaseUserProfile {
    return this.profile;
  }

  public getProfileData(): any {
    return this.profile.data;
  }

  public setDataKey(key: any, value: any): void {
    this.profile.data[key] = value;
  }

  public getDataKey(key: any): any {
    return this.profile.data[key];
  }

  public async save(): Promise<void> {
    await PluginListener.emit(PluginEvent.SAVING_PROFILE, null, ListenerArgs.create().append("user", this));
    this.dataFixer();
    Files.write(this.path, JSON.stringify(this.profile, null, 2));
  }
}
