import {UserInfo} from "../../../core/user/UserInfo";
import {Recipe} from "./Recipe";
import {ItemStacks} from "../item/Item";

export class CraftingItems {
  public static async crafting(user: UserInfo, recipe: Recipe): Promise<boolean> {
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
    await user.save();
    return true;
  }
}
