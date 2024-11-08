import {Files} from "../utils/Files";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {BaseUserProfile} from "./BaseUserProfile";
import {UserManager} from "./UserManager";
import {DataFixerBuilder} from "../data/DataFixerBuilder";
import {PluginEvent, PluginListener} from "../plugins/Plugins";

export class UserProfile {
  public profile: BaseUserProfile;
  public path: string;
  public static dataFixer = DataFixerBuilder.createBuilder("user_profile")
    .createDataKey("sign_system",{"timestamp": 0})
    .createDataKey("inventory",[])
    .createDataKey("next_message",{"open": false, "message": null, "state": 0 })
    .build();

  constructor(path: string);
  constructor(user_id: number);
  constructor(session: Session<User.Field, Channel.Field, Context>);
  constructor(arg: string | number | Session<User.Field, Channel.Field, Context>) {
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
      this.path = UserManager.getUserPath(arg);
      this.save();
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
      this.path = UserManager.getUserPath(arg.event.user.id);
      this.save();
    }
    this.loadProfile();
    this.dataFixer();
    this.loadModule();
    this.save();
  }
  public custom(fields: any, ...arg: any[]) {
    this[fields](...arg);
  }
  public setCustom(target: any, fields: any) {
    this[target] = fields;
  }
  public getCustom(fields: any) {
    return this[fields];
  }

  private loadProfile() {
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
  }
  public loadModule(): void {
    PluginListener.emit(PluginEvent.LOADING_PROFILE, null, this);
  }
  public dataFixer(): void {
    if(!UserProfile.dataFixer.isFrozen()) {
      throw new Error("No data-fixer has been built");
    }
    for (const [key, fixer] of UserProfile.dataFixer.all()) {
      fixer.verify(this.profile.data);
    }
  }

  public hasPermission(permissions: string): boolean {
    return this.profile.permissions.includes(permissions);
  }

  public hasPermissionLevel(permission_level: number): boolean {
    return this.profile.permission_level >= permission_level;
  }

  public getProfile(): BaseUserProfile {
    return this.profile;
  }
  public getProfileData(): any {
    return this.profile.data;
  }
  public getDataKey(key: any): any {
    return this.profile.data[key];
  }

  public save() {
    PluginListener.emit(PluginEvent.SAVING_PROFILE, null, this);
    this.dataFixer();
    Files.write(this.path, JSON.stringify(this.profile, null, 2));
  }
}
