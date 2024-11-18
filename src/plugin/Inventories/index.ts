import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {Items} from "./item/Items";
import {UserProfile} from "../../core/user/UserProfile";
import {Inventory} from "./item/Inventory";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {PluginListener} from "../../core/plugins/PluginListener";
import {CustomDataFactory} from "../../core/data/CustomDataFactory";

export class Inventories extends PluginInitialization {
  constructor() {
    super("inventories");
  }
  public load() {
    Items.init();
    CustomDataFactory.createKey("inventory",[]);
    PluginListener.on(PluginEvent.LOADING_PROFILE, this.plugin_id, (session, args) => {
      const userProfile: UserProfile = args;
      userProfile["INSTANCE_INVENTORY"] = new Inventory(userProfile);
    });
    PluginListener.on(PluginEvent.SAVING_PROFILE, this.plugin_id, (session, args) => {
      const userProfile: UserProfile = args;
      const invInstance: Inventory = userProfile.getCustom("INSTANCE_INVENTORY");
      if(invInstance && invInstance.save) invInstance.save();
    });
  }
}
