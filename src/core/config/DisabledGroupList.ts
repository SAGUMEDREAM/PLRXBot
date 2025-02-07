// export class DisabledGroupList {
//   public static list = [
//     "584570528",
//     "590104798",
//     "426230045",
//     "589711336"
//   ];
//
//   public static getList() {
//     return this.list;
//   }
// }

import {Config} from "../data/Config";

export interface DisabledGroupListImpl {
  list: string[];
}

export class DisabledGroupList {
  private static INSTANCE: DisabledGroupList;
  private config: Config<DisabledGroupListImpl>;

  private constructor() {
    this.config = <Config<DisabledGroupListImpl>>Config.createConfig("disabled_group_list", {list: []});
  }

  public static getInstance(): DisabledGroupList {
    if (!this.INSTANCE) {
      this.INSTANCE = new DisabledGroupList();
    }
    return this.INSTANCE;
  }

  public reload(): void {
    this.config = <Config<DisabledGroupListImpl>>Config.createConfig("disabled_group_list", {list: []});
  }

  public getConfigInstance(): Config<DisabledGroupListImpl> {
    return this.config;
  }
}
