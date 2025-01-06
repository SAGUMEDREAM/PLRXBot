import {Item, ItemStacks} from "../item/Item";
import {UserProfile} from "../../../core/user/UserProfile";

export interface RecipeItem {
  item: Item;
  amount: number;
}

export class Recipe {
  public readonly requires: RecipeItem[];
  public readonly result: RecipeItem;
  public constructor(requires: RecipeItem[], result: RecipeItem) {
    this.requires = requires;
    this.result = result;
  }
  public matches(user: UserProfile): boolean {
    const itemStacks: ItemStacks = user["ITEM_STACKS"];
    if (!itemStacks) {
      return false;
    }

    for (const recipeItem of this.requires) {
      if (!itemStacks.hasItem(recipeItem.item, recipeItem.amount)) {
        return false;
      }
    }
    return true;
  }
}
export class RecipeBuilder {
  private readonly requires: RecipeItem[];
  private result: RecipeItem;
  public constructor() {
    this.requires = [];
    this.result = null;
  }
  public addItem(item: Item, amount: number = 1): RecipeBuilder {
    this.requires.push({ item, amount });
    return this;
  }
  public setResult(item: Item, amount: number = 1): RecipeBuilder {
    this.result = { item, amount };
    return this;
  }
  public build(): Recipe {
    if (this.result != null && this.requires.length != 0) {
      return new Recipe(this.requires, this.result);
    }
    return null;
  }
}
