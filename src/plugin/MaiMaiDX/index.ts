import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandB50} from "./command/CommandB50";
import {Files} from "../../core/utils/Files";
import path from "path";
import {Utils} from "../../core/utils/Utils";
import {CommandAlias} from "./command/CommandAlias";
import {CommandRandomMusic} from "./command/CommandRandomMusic";
import {MusicOptional} from "./data/MusicOptional";
import {CommandQueryMusic} from "./command/CommandQueryMusic";
import {CommandSearchMusic} from "./command/CommandSearchMusic";
import {CommandPlayMusic} from "./command/CommandPlayMusic";

export class MaiMaiDX extends PluginInitialization {
  public alias = [];
  public optional: MusicOptional;
  public static INSTANCE: MaiMaiDX;

  constructor() {
    super("maimai_dx");
    MaiMaiDX.INSTANCE = this;
  }

  public load() {
    this.optional = new MusicOptional();
    const instance = this.commandManager;
    instance.registerCommand(["b50"], CommandB50.get());
    instance.registerCommand(["alias", "别名"], CommandAlias.get());
    instance.registerCommand(["随机歌曲"], CommandRandomMusic.get());
    instance.registerCommand(["查歌"], CommandQueryMusic.get());
    instance.registerCommand(["搜歌"], CommandSearchMusic.get());
    instance.registerCommand(["点歌"], CommandPlayMusic.get());

    // this.asyncLoad();
  }

  public async asyncLoad(): Promise<void> {
    if (this.alias == null || this.alias.length == 0) {
      this.alias = Files.readCSV(path.join(Utils.getRoot(), 'assets', 'maimai', 'aliases.csv'));
      if (this.alias == null) {
        this.alias = [];
      }
    }
  };
}
