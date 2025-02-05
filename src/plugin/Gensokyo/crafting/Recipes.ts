import {Recipe, RecipeBuilder} from "./Recipe";
import {Gensokyo} from "../index";

export class Recipes {
  private static recipes: Map<string, Recipe> = new Map<string, Recipe>();
  public static init() {

  }

  public static registerRecipe(recipeId: string, recipe: Recipe): Recipe {
    if (this.recipes.has(recipeId)) {
      Gensokyo.INSTANCE.pluginLogger.error(`Recipe with ID ${recipeId} already exists.`);
      return null;
    }
    this.recipes.set(recipeId, recipe);
    return recipe;
  }

  public static register(recipeId: string, builder: RecipeBuilder): Recipe {
    if (this.recipes.has(recipeId)) {
      Gensokyo.INSTANCE.pluginLogger.error(`Recipe with ID ${recipeId} already exists.`);
      return null;
    }
    const recipe = builder.build();
    this.registerRecipe(recipeId, recipe);
    return recipe;
  }

  public static getRecipe(recipeId: string): Recipe | undefined {
    return this.recipes.get(recipeId);
  }

  public static getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }
}
