import {UserProfile} from "../../../core/user/UserProfile";
import {Recipe} from "./Recipe";
import {ItemStacks} from "../item/Item";

export class CraftingItems {
  public static crafting(user: UserProfile, recipe: Recipe): boolean {
    let itemStacks: ItemStacks = user["ITEM_STACKS"];
    if (!recipe.matches(user)) {
      return false;
    }

    for (const recipeItem of recipe.requires) {
      if (!itemStacks.removeItem(recipeItem.item, recipeItem.amount)) {
        return false;
      }
    }

    const resultItem = recipe.result;
    itemStacks.addItem(resultItem.item, resultItem.amount)
    user.save();
    return true;
  }
}
