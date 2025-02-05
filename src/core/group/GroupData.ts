import {BaseGroupData} from "./BaseGroupData";
import {Constant} from "../Constant";
import path from "path";
import {Files} from "../utils/Files";
import {DataFixerBuilder} from "../data/DataFixerBuilder";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import deasync from 'deasync';
import {botInstance} from "../../index";
import {PluginEvent} from "../plugins/PluginEvent";
import {PluginListener} from "../plugins/PluginListener";

export class GroupData {
  public group_id: number;
  public path: string;
  public groupData: BaseGroupData;
  public static dataFixer = DataFixerBuilder.createBuilder("user_profile")
    .build()
  public constructor(group_id: string | number) {
    if (typeof group_id === "number") {
      this.group_id = group_id;
    } else {
      this.group_id = Number(group_id);
    }
    this.init();
  }
  private init() {
    this.path = path.resolve(Constant.GROUP_DATA_PATH, `${this.group_id}.json`);
    this.load();
    this.dataFixer();
    this.save();
  }
  public async kick(userId: any, block: boolean) {
    return botInstance.kickGuildMember(this.group_id.toString(), userId, block);
  }
  public async mute(userId: any, time: number) {
    return botInstance.muteGuildMember(this.group_id.toString(), userId, time);
  }
  public async isGroupAdmin(userId: any): Promise<boolean> {
    try {
      const result = await botInstance?.getGuildMemberList(this.group_id.toString());
      if (!result || !result.data) return false;

      return result.data.some(user =>
        (user.roles.includes('admin') || user.roles.includes('owner')) && user.user.id === userId
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public dataFixer(): void {
    if(!GroupData.dataFixer.isConfirm()) {
      throw new Error("No data-fixer has been built");
    }
    for (const [key, fixer] of GroupData.dataFixer.all()) {
      fixer.verify(this.groupData.data);
    }
  }
  public hasPermission(type: string) {
    return this.groupData.permissions.includes(type);
  }
  public load() {
    if(Files.exists(this.path)) {
      const fr = Files.read(this.path);
      const data = JSON.parse(fr);
      this.groupData = {
        group_id: data.target_group_id,
        banned: data.banned,
        permissions: data.permissions,
        data: data.data
      };
    } else {
      this.groupData = {
        group_id: this.group_id,
        banned: false,
        permissions: [],
        data: {}
      };
      this.save();
    }
    PluginListener.emit(PluginEvent.LOADING_GROUP_DATA, null, this);
  }
  public save() {
    PluginListener.emit(PluginEvent.SAVING_GROUP_DATA, null, this);
    Files.write(this.path,JSON.stringify(this.groupData, null, 2));
  }
}
