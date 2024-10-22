import {ItemEntry} from "./ItemEntry";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserProfile} from "../../../core/user/UserProfile";

export class Items {
  public static readonly ITEMS: Map<string,ItemEntry> = new Map<string,ItemEntry>();
  public static init() {
    this.register(
      "coin",
      (userProfile: UserProfile) => {

      },
      (userProfile: UserProfile) => {

      }
    );
  }
  public static register(
    registry_key: string,
    onUse?: ((userProfile: UserProfile) => void),
    onGet?: ((userProfile: UserProfile) => void)
  ): ItemEntry {
    return (() => {
      let itemStack = new ItemEntry(registry_key);
      if (this.get(registry_key) != null) {
        itemStack.onUse = onUse || ((userProfile: UserProfile) => {});
        itemStack.onGet = onGet || ((userProfile: UserProfile) => {});
        this.ITEMS.set(registry_key, itemStack);
      } else {
        itemStack = this.get(registry_key);
      }
      return itemStack;
    })();
  }
  public static unregister(registry_key: string) {
    this.ITEMS.delete(registry_key);
  }
  public static get(registry_key: string) {
    return this.ITEMS.get(registry_key) || null;
  }
}
