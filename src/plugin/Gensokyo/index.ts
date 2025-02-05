import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {Items} from "./item/Items";
import {UserProfile} from "../../core/user/UserProfile";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {PluginListener} from "../../core/plugins/PluginListener";
import {CustomDataFactory} from "../../core/data/CustomDataFactory";
import {ItemStacks} from "./item/Item";
import {Recipes} from "./crafting/Recipes";
import {Tags} from "./tag/Tags";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandViewInv} from "./command/CommandViewInv";
import {CommandLuckyDraw} from "./command/CommandLuckyDraw";

export class Gensokyo extends PluginInitialization {
  public static INSTANCE: Gensokyo;
  constructor() {
    super("gensokyo");
    Gensokyo.INSTANCE = this;
  }
  public load() {
    Items.init();
    Tags.init();
    Recipes.init();

    const instance = CommandManager.getInstance();
    instance.registerCommand(["view", "查询库存"], CommandViewInv.get());
    instance.registerCommand(["lucky_draw", "抽奖"], CommandLuckyDraw.get());

    CustomDataFactory.createKey("item_stacks",[]);
    PluginListener.on(PluginEvent.LOADING_PROFILE, this.plugin_id, (session, args) => {
      let user: UserProfile = args;
      user["ITEM_STACKS"] = new ItemStacks(user);
      user["ITEM_STACKS"].load();
    });
    PluginListener.on(PluginEvent.SAVING_PROFILE, this.plugin_id, (session, args) => {
      let user: UserProfile = args;
      let itemStacks: ItemStacks = user["ITEM_STACKS"];
      if(itemStacks != null && itemStacks.save) itemStacks.save();
    });
  }
}
