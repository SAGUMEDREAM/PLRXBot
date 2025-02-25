import {PluginInitialization} from "../plugins/PluginInitialization";
import {PluginListener} from "../plugins/PluginListener";
import {PluginEvent} from "../plugins/PluginEvent";
import {UserInfo} from "../user/UserInfo";
import {CustomDataInstance} from "./CustomDataInstance";
import {LOGGER} from "../../index";
import {DataFixerBuilder} from "./DataFixerBuilder";

export class CustomDataFactory {
  public static create<T extends CustomDataInstance>(
    data_id: string,
    pluginId: string | PluginInitialization,
    clazzObject: new (user: UserInfo) => T
  ): boolean {
    let instance_data_id = "INSTANCE_" + data_id.toUpperCase();
    try {
      PluginListener.on(PluginEvent.LOADING_PROFILE, pluginId, (session, args) => {
        const user: UserInfo = args.get("user");
        user[instance_data_id] = new clazzObject(user);
        user[instance_data_id]["instance_data_id"] = instance_data_id;
      });

      PluginListener.on(PluginEvent.SAVING_PROFILE, pluginId, (session, args) => {
        const user: UserInfo = args.get("user");
        const instance: CustomDataInstance = user.getCustom(instance_data_id);
        if (instance != null) instance.save();
      });
      return true;
    } catch (e) {
      if(pluginId instanceof PluginInitialization) {
        pluginId.pluginLogger.error(e);
      } else {
        LOGGER.error(e);
      }
      return false;
    }
  }
  public static createKey(key: string, defaultValue: any = null): DataFixerBuilder {
    return UserInfo.dataFixer.createDataKey(key, defaultValue)
  }
  public static removeKey(key: string): DataFixerBuilder {
    return UserInfo.dataFixer.removeDataKey(key)
  }
  public static moveKey(key0: string, key1: string): DataFixerBuilder {
    return UserInfo.dataFixer.moveDataKey(key0, key1)
  }
}
