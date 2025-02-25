import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {Items} from "./item/Items";
import {UserInfo} from "../../core/user/UserInfo";
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

    const instance = this.commandManager;
    instance.registerCommand(["view", "查询库存"], CommandViewInv.get());
    instance.registerCommand(["lucky_draw", "抽奖"], CommandLuckyDraw.get());

    CustomDataFactory.createKey("item_stacks",[]);
    PluginListener.on(PluginEvent.LOADING_PROFILE, this.plugin_id, async (session, args) => {
      let user: UserInfo = args.get("user");
      user.setCustom("ITEM_STACKS", new ItemStacks(user))
      user.getCustom("ITEM_STACKS")?.load();
    });
    PluginListener.on(PluginEvent.SAVING_PROFILE, this.plugin_id, async (session, args) => {
      let user: UserInfo = args.get("user");
      let itemStacks: ItemStacks = user.getCustom("ITEM_STACKS");
      if(itemStacks != null) itemStacks.save();
    });
  }
}
