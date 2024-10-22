import {ItemEntry} from "./ItemEntry";
import {UserProfile} from "../../../core/user/UserProfile";
import {Items} from "./Items";

export class ItemStack {
  protected registry_key: string;
  protected count: number;
  public constructor(registry_key: string, count: number) {
    this.registry_key = registry_key;
    this.count = count;
  }
  public getRegistryKey() {
    return this.registry_key;
  }
  public addCount(count: number) {
    this.count += count;
  }
  public removeCount(count: number) {
    if (this.count - count < 0) {
      return;
    }
    this.count -= count;
  }

  public setCount(count: number) {
    this.count = count;
  }
  public getCount() {
    return this.count;
  }
}
export class Inventory {
  private userProfile: UserProfile;
  public itemStacks: ItemStack[] = new Array<ItemStack>();
  public constructor(userProfile: UserProfile) {
    this.userProfile = userProfile;
    this.init();
  }
  public save() {
    this.userProfile.profile.data["inventory"] = this.itemStacks.map((sStack) => ({
      registry_key: sStack.getRegistryKey(),
      count: sStack.getCount(),
    }));
  }
  public init() {
    const objInv = this.userProfile.getDataKey("inventory");
    if (Array.isArray(objInv)) {
      objInv.forEach((itemStack: { registry_key: string, count: number }) => {
        const { registry_key, count } = itemStack;
        this.itemStacks.push(new ItemStack(registry_key, count));
      });
    }
  }
  public add(registry_key: string, count: number) {
    let iStack = this.getItemStack(registry_key);
    if (iStack != null) {
      iStack.addCount(count);
    } else {
      const iEntry = Items.get(registry_key);
      if (iEntry != null) {
        const nStack = new ItemStack(registry_key, count);
        this.itemStacks.push(nStack);
      }
    }
    this.save();
  }
  public hasCount(registry_key: string, count: number): boolean {
    let iStack = this.getItemStack(registry_key);
    if(iStack != null) {
      return iStack.getCount() >= count;
    } else {
      return false;
    }
  }
  public getItemStack(registry_key: string): ItemStack | null {
    for (const iStack of this.itemStacks) {
      if (registry_key === iStack.getRegistryKey()) {
        return iStack;
      }
    }
    return null;
  }
  public has(registry_key: string): boolean {
    const iStack = this.getItemStack(registry_key);
    return iStack != null && iStack.getCount() >= 1;
  }
}
