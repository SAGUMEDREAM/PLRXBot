import {UserProfile} from "../../../core/user/UserProfile";
import {Gensokyo} from "../index";
import {Text} from "../../../core/language/Text";

export class ItemStacks {
  private readonly user: UserProfile;
  public itemStack: ItemStack[];

  constructor(user: UserProfile) {
    this.user = user;
  }

  public addItem(item: Item, amount: number = 1) {
    if (!item || !item.item_id) {
      Gensokyo.onlyInstance.pluginLogger.error(`Invalid item provided.`);
      return;
    }

    if (amount <= 0) {
      Gensokyo.onlyInstance.pluginLogger.error(`Amount must be a positive integer.`);
      return;
    }

    for (const itemStack of this.itemStack) {
      if (item.item_id === itemStack.item_id) {
        itemStack.amount += amount;
        return;
      }
    }

    this.itemStack.push({
      item_id: item.item_id,
      amount: amount,
    });
  }

  public removeItem(item: Item, amount: number = 1): boolean {
    if (!item || !item.item_id) {
      Gensokyo.onlyInstance.pluginLogger.error(`Invalid item provided.`);
    }

    if (amount <= 0) {
      Gensokyo.onlyInstance.pluginLogger.error(`Amount must be a positive integer.`);
      return false;
    }

    for (let i = 0; i < this.itemStack.length; i++) {
      const itemStack = this.itemStack[i];
      if (item.item_id === itemStack.item_id) {
        itemStack.amount -= amount;

        if (itemStack.amount <= 0) {
          this.itemStack.splice(i, 1);
        }
        return true;
      }
    }
  }

  public hasItem(item: Item, amount: number = 0): boolean {
    if (!item || !item.item_id) {
      Gensokyo.onlyInstance.pluginLogger.error(`Invalid item provided.`);
      return false;
    }

    if (amount < 0) {
      Gensokyo.onlyInstance.pluginLogger.error(`Amount must be a non-negative integer.`);
      return false;
    }

    for (const itemStack of this.itemStack) {
      if (item.item_id === itemStack.item_id && itemStack.amount >= amount) {
        return true;
      }
    }

    return false;
  }

  public modify(f: () => void) {
    f();
    this.save();
  }

  public load() {
    const rawData = this.user.profile.data["item_stacks"];
    if (rawData == null || !Array.isArray(rawData)) {
      this.itemStack = [];
    } else {
      this.itemStack = rawData;
    }
    this.user.save();
  }

  public save() {
    this.user.profile.data["item_stacks"] = this.itemStack;
  }

  public getUser() {
    return this.user;
  }
}

export class ItemStack {
  item_id: string;
  amount: number;
}

export class Item {
  public item_id: string = null;

  public constructor() {
  }

  public getName(): string {
    return Text.of("item." + this.item_id + ".name")
  }
}
