import {Item, ItemStacks} from "./Item";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../../../core/user/UserManager";

export class Items {
  public static readonly ITEMS: Map<string, Item> = new Map<string, Item>();
  public static init() {
    this.register("fluff", new Item());
    this.register("cloth", new Item());
    this.register("wood", new Item());
    this.register("coal", new Item());
    this.register("metal_block", new Item());
    this.register("magic_stone", new Item());
    this.register("redstone", new Item());
    this.register("godly_ore", new Item());
    this.register("bhavaagra", new Item());
    this.register("moon_stone", new Item());
    this.register("soul", new Item());
    this.register("cursed_item", new Item());
    this.register("blessed_water", new Item());
    this.register("component", new Item());
    this.register("mushroom", new Item());
    this.register("bamboo", new Item());
    this.register("bamboo_shoots", new Item());
    this.register("apple", new Item());
    this.register("fern_powder", new Item());
    this.register("sweet_potato", new Item());
    this.register("lily_of_the_valley", new Item());
    this.register("sakura", new Item());
    this.register("rose", new Item());
    this.register("rhododendron", new Item());
    this.register("red_hakurei", new Item());
    this.register("underworld_flower", new Item());
    this.register("orchid", new Item());
    this.register("flower_of_the_other_shore", new Item());
    this.register("shamrock", new Item());
    this.register("sunflower", new Item());
    this.register("unknown", new Item());

  }
  public static register(item_id: string, item: Item): Item {
    if(!this.ITEMS.has(item_id)) {
      this.ITEMS.set(item_id, item);
      item.item_id = item_id;
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
