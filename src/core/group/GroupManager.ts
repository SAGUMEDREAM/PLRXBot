import {LOGGER} from "../../index";
import {GroupInfo} from "./GroupInfo";
import {Files} from "../utils/Files";
import path from "path";
import {Constant} from "../Constant";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {Reloadable} from "../impl/Reloadable";

export class GroupManager implements Reloadable {
  private static readonly INSTANCE = new GroupManager();
  private group_data: Map<number | string, GroupInfo> = new Map<number | string, GroupInfo>();

  public load() {
    LOGGER.info("Loading GroupManager...");
  }

  public async reload(): Promise<void> {
    for (const groupData of this.group_data.values()) {
      await groupData.save();
    }
    this.group_data.clear();
  }

  private static getGroupId(args: number | string | Session<User.Field, Channel.Field, Context>): number | string | null {
    if (typeof args === "number" || typeof args === "string") {
      return args;
    } else {
      const group_id = args.channelId;
      return group_id ?? null;
    }
  }

  public static exists(args: number | string | Session<User.Field, Channel.Field, Context>): boolean {
    const group_id = this.getGroupId(args);
    if (group_id === null) return false;
    return this.has(group_id) || Files.exists(path.resolve(this.getGroupDataPath(), group_id + ".json"));
  }

  public static has(args: number | string | Session<User.Field, Channel.Field, Context>): boolean {
    const group_id = this.getGroupId(args);
    if (group_id === null) return false;
    return this.INSTANCE.group_data.has(group_id);
  }

  public static async hasPermission(args: number | string | Session<User.Field, Channel.Field, Context>, permission: string): Promise<boolean> {
    if (typeof args === "number" || typeof args === "string") {
      return (await this.get(args))?.hasPermission(permission);
    } else {
      return (await this.get(args))?.hasPermission(permission);
    }
  }

  public static async get(args: number | string | Session<User.Field, Channel.Field, Context>): Promise<GroupInfo | undefined> {
    const getGroupId = (async (group_id: number | string): Promise<GroupInfo> => {
      if (this.INSTANCE.group_data.has(group_id)) {
        return this.INSTANCE.group_data.get(group_id);
      } else if (Files.exists(path.resolve(Constant.GROUP_DATA_PATH, (group_id + ".json")))) {
        const groupInfo = await GroupInfo.getConstructor(group_id);
        this.add(group_id, groupInfo);
        return groupInfo;
      } else {
        return null;
      }
    });

    const group_id = this.getGroupId(args);
    if (group_id === null) return undefined;
    return await getGroupId(group_id);
  }

  public static add(args: number | string | Session<User.Field, Channel.Field, Context>, groupData: GroupInfo) {
    const group_id = this.getGroupId(args);
    if (group_id !== null) {
      this.INSTANCE.group_data.set(group_id, groupData);
    }
  }

  public static async createGroupData(args: number | string | Session<User.Field, Channel.Field, Context>): Promise<GroupInfo> {
    const group_id = this.getGroupId(args);
    if (group_id === null) {
      LOGGER.error("Invalid group ID or session.");
      return null;
    }
    const group_data = await GroupInfo.getConstructor(group_id);
    this.add(group_id, group_data);
    return group_data;
  }

  public static create(): GroupManager {
    this.INSTANCE.load();
    return this.INSTANCE;
  }

  public static getInstance() {
    return this.INSTANCE;
  }

  public static getGroupDataPath() {
    return Constant.GROUP_DATA_PATH;
  }
}
