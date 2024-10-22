import {Text} from "../../../core/language/Text";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserProfile} from "../../../core/user/UserProfile";
import {Inventory} from "./Inventory";
import {LOGGER} from "../../../index";

export class ItemEntry {
  public name: string;
  public registry_key: string;
  public onUse:(userProfile: UserProfile) => void;
  public onGet:(userProfile: UserProfile) => void;
  constructor(registry_key: string) {
    this.name = "item." + registry_key + "name";
    this.registry_key = registry_key;
  }
  public useAction(userProfile: UserProfile) {
    try {
      const invInstance: Inventory = userProfile.getCustom("INSTANCE_INVENTORY");
      if(invInstance.has(this.registry_key)) {
        invInstance.add(this.registry_key, -1);
      }
      invInstance.save();
    } catch (err) {
      LOGGER.error(err);
    } finally {
      this.onUse(userProfile);
    }
  }
  public getAction(userProfile: UserProfile) {
    this.onGet(userProfile);
  }
  public getName(): string {
    return Text.of(this.name);
  }
}
