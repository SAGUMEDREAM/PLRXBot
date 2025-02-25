import {BaseGroupData} from "./BaseGroupData";
import {Constant} from "../Constant";
import path from "path";
import {Files} from "../utils/Files";
import {DataFixerBuilder} from "../data/DataFixerBuilder";
import {botOptional, contextOptional, LOGGER, onebotOptional} from "../../index";
import {PluginEvent} from "../plugins/PluginEvent";
import {ListenerArgs, PluginListener} from "../plugins/PluginListener";

export class GroupInfo {
  public group_id: number;
  public path: string;
  public groupData: BaseGroupData;
  public static dataFixer: DataFixerBuilder = DataFixerBuilder.createBuilder("group_profile")
    .build()
  public constructor(group_id: string | number) {
    if (typeof group_id === "number") {
      this.group_id = group_id;
    } else {
      this.group_id = Number(group_id);
    }
  }
  public static async getConstructor(arg: any): Promise<GroupInfo> {
    const group = new GroupInfo(arg);
    await group.init();
    return group;
  }

  private async init() {
    this.path = path.resolve(Constant.GROUP_DATA_PATH, `${this.group_id}.json`);
    await this.load();
    this.dataFixer();
    await this.save();
    return this;
  }
  public async kick(userId: any, block: boolean) {
    return botOptional.value?.kickGuildMember(this.group_id.toString(), userId, block);
  }
  public async mute(userId: any, time: number) {
    return botOptional.value?.muteGuildMember(this.group_id.toString(), userId, time);
  }
  public async isGroupAdmin(userId: any): Promise<boolean> {
    try {
      const result = await botOptional?.value?.getGuildMemberList(this.group_id.toString());
      if (!result || !result.data) return false;

      return result.data.some(user =>
        (user.roles.includes('admin') || user.roles.includes('owner')) && user.user.id === userId
      );
    } catch (error) {
      LOGGER.error(error);
      return false;
    }
  }
  public async getMemberList() {
    let users = await onebotOptional.get()?.getGroupMemberList(
      this.group_id,
      true
    );
    users = users?.filter(
      (user) => user.role === "member" && !contextOptional.get().bots[user.user_id]
    );
    return users;
  }

  public async getMemberListAll() {
    let users = await onebotOptional.get()?.getGroupMemberList(
      this.group_id,
      true
    );
    users = users?.filter((user) => !contextOptional.get().bots[user.user_id]);
    return users;
  }

  public dataFixer(): void {
    if(!GroupInfo.dataFixer.isConfirm()) {
      throw new Error("No data-fixer has been built");
    }
    for (const [key, fixer] of GroupInfo.dataFixer.all()) {
      fixer.verify(this.groupData.data);
    }
  }

  public hasPermission(type: string) {
    return this.groupData.permissions.includes(type);
  }

  public async load() {
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
      await this.save();
    }
    await PluginListener.emit(PluginEvent.LOADING_GROUP_DATA, null, ListenerArgs.create().append("user", this));
  }
  public async save() {
    await PluginListener.emit(PluginEvent.SAVING_GROUP_DATA, null, ListenerArgs.create().append("user", this));
    Files.write(this.path,JSON.stringify(this.groupData, null, 2));
  }
}
