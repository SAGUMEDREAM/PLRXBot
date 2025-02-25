import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CustomDataFactory} from "../../core/data/CustomDataFactory";
import {CommandWorship} from "./command/CommandWorship";
import {UserInfo} from "../../core/user/UserInfo";
import {CommandCheckFaith} from "./command/CommandCheckFaith";

export class Shrines {
  static getObject(user: UserInfo): ShrineObject {
    return user.getProfileData()["shrine_data"];
  }
}

export class ShrineObject {
  public level: number = 0;
  public faith: number = 0;
  public count: number = 0;
}

export class Shrine extends PluginInitialization {
  constructor() {
    super("shrine");
  }

  public load(): void {
    const instance = this.commandManager;
    instance.registerCommand(["参拜神社", "参拜", "worship", "visit"], CommandWorship.get());
    instance.registerCommand(["查询信仰"], CommandCheckFaith.get());
    CustomDataFactory.createKey("shrine_data", {"level": 0, "faith": 0, "count": 0});
  }
}
