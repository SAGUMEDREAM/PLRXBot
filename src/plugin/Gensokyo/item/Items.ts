import {Item, ItemStacks} from "./Item";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../../../core/user/UserManager";

export class Items {
  public static readonly ITEMS: Map<string, Item> = new Map<string, Item>();
  public static strange_umbrella: Item;
  public static water_gun: Item;
  public static water_cannon: Item;
  public static robotic_arm: Item;
  public static camera: Item;
  public static computer: Item;
  public static phone: Item;
  public static cleaner: Item;
  public static hand_truck: Item;
  public static ladle: Item;

  public static unknown: Item;
  public static init() {
    this.strange_umbrella = this.registerItem("strange_umbrella", new Item());
    this.water_gun = this.registerItem("water_gun", new Item());
    this.water_cannon = this.registerItem("water_cannon", new Item());
    this.robotic_arm = this.registerItem("robotic_arm", new Item());
    this.camera = this.registerItem("camera", new Item());
    this.computer = this.registerItem("computer", new Item());
    this.phone = this.registerItem("phone", new Item());
    this.cleaner = this.registerItem("cleaner", new Item());
    this.hand_truck = this.registerItem("hand_truck", new Item());
    this.ladle = this.registerItem("ladle", new Item());

    this.unknown = this.registerItem("unknown", new Item());
  }
  public static registerItem(item_id: string, item: Item): Item {
    if(!this.ITEMS.has(item_id)) {
      this.ITEMS.set(item_id, item);
      item.setItemId(item_id);
      return item;
    }
    return null;
  }
  public static getItemStacks(session: Session<User.Field, Channel.Field, Context>): ItemStacks {
    return UserManager.get(session)["ITEM_STACKS"];
  }

  public static getItem(item_id: string): Item {
    return this.ITEMS.get(item_id)
  }
}
