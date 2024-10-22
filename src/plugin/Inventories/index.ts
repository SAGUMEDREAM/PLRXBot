import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {Items} from "./item/Items";
import {PluginEvent, PluginListener} from "../../core/plugins/Plugins";
import {UserProfile} from "../../core/user/UserProfile";
import {Inventory} from "./item/Inventory";

export class Inventories extends PluginInitialization {
  constructor() {
    super("inventories");
  }
  public load() {
    Items.init();
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
