import { LOGGER } from "../../index";
import { GroupData } from "./GroupData";
import { Files } from "../utils/Files";
import path from "path";
import { Constant } from "../Constant";
import { Context, Session } from "koishi";
import { Channel, User } from "@koishijs/core";

export class GroupManager {
  private static readonly INSTANCE = new GroupManager();
  private group_data: Map<number | string, GroupData> = new Map<number | string, GroupData>();

  public load() {
    LOGGER.info("Loading GroupManager...");
  }
  private static getGroupId(args: number | string | Session<User.Field, Channel.Field, Context>): number | string | null {
    if (typeof args === "number" || typeof args === "string") {
      return args;
    } else {
      const group_id = args?.event?.channel?.id;
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

  public static hasPermission(args: number | string | Session<User.Field, Channel.Field, Context>, permission: string): boolean{
    if (typeof args === "number" || typeof args === "string") {
      return this.get(args)?.hasPermission(permission);
    } else {
      return this.get(args)?.hasPermission(permission);
    }
  }

  public static get(args: number | string | Session<User.Field, Channel.Field, Context>): GroupData | undefined {
    const getGData = (gId: number | string) => {
      if (this.INSTANCE.group_data.has(gId)) {
        return this.INSTANCE.group_data.get(gId);
      } else if (Files.exists(path.resolve(Constant.GROUP_DATA_PATH, (gId + ".json")))) {
        const gData = new GroupData(gId);
        this.add(gId, gData);
        return gData;
      } else {
        return null;
      }
    };

    const group_id = this.getGroupId(args);
    if (group_id === null) return undefined;
    return getGData(group_id);
  }

  public static add(args: number | string | Session<User.Field, Channel.Field, Context>, groupData: GroupData) {
    const group_id = this.getGroupId(args);
    if (group_id !== null) {
      this.INSTANCE.group_data.set(group_id, groupData);
    }
  }

  public static createGroupData(args: number | string | Session<User.Field, Channel.Field, Context>): GroupData {
    const group_id = this.getGroupId(args);
    if (group_id === null) {
      throw new Error("Invalid group ID or session.");
    }
    const group_data = new GroupData(group_id);
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
