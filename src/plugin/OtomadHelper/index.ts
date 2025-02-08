import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandOtomadHelper} from "./command/CommandOtomadHelper";
import {CommandProvider} from "../../core/command/CommandProvider";
import {Context, h, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {Messages} from "../../core/network/Messages";
import {CommandNewtone} from "./command/CommandNewtone";
import {CommandBilibiliDownload} from "./command/CommandBilibiliDownload";
import {CommandSpherization} from "./command/CommandSpherization";
import {CommandDespherization} from "./command/CommandDespherization";
import {CommandCrystalBall} from "./command/CommandCrystalBall";
import {CommandIMSoHappy} from "./command/CommandIMSoHappy";
import {CommandMaiFriend} from "./command/CommandMaiFriend";
import {CommandMaiAwake} from "./command/CommandMaiAwake";
import {CommandSoundCreation} from "./command/CommandSoundCreation";

export class OtomadHelper extends PluginInitialization {
  public static INSTANCE: PluginInitialization;
  constructor() {
    super("otomad_helper");
    OtomadHelper.INSTANCE = this;
  }

  private fastUrl(session: Session<User.Field, Channel.Field, Context>, url: string) {
    let result = "";
    let atUser = Messages.at(Number(session.userId));

    result += `${atUser} ${url}`;

    Messages.sendMessageToReply(session, result);
  }

  public load() {
    const instance = CommandManager.getInstance();
    const helper = CommandOtomadHelper.getInstance();
    helper.addFast(["艾拉软件库"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://s.otm.ink/airasoft/")));
    helper.addFast(["音MAD维基", "音MAD中文维基"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://otomad.wiki/")));
    helper.addFast(["音MAD贴吧", "音MAD吧"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://tieba.baidu.com/f?kw=%D2%F4mad")));
    helper.addFast(["音MAD教学"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://s.otm.ink/tutorial")));
    helper.addFast(["音MAD社团"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://s.otm.ink/group")));
    helper.addFast(["人声分离", "音频分离"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://vocalremover.org/")));
    helper.addFast(["东方midi", "东方MIDI", "touhou"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://gamebanana.com/search?_nPage=1&_sOrder=best_match&_idGameRow=8&_sSearchString=MIDI+collection+-+Touhou+Project")));
    helper.addFast(["MidiShow", "midishow", "midi_show"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://www.lookae.com/")));
    helper.addFast(["LookAE", "look_ae", "lookae"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://www.lookae.com/")));
    helper.addFast(["免费日语字体"], new CommandProvider().onExecute((session, args) => this.fastUrl(session, "https://www.freejapanesefont.com/")));
    instance.registerCommand(["音MAD助手", "otomad_helper", "otomadhelper"], helper.root);
    instance.registerCommand(["帮我修音","修音","newtone"], CommandNewtone.get());
    instance.registerCommand(["声音创作","音MAD创作"], CommandSoundCreation.get());
    instance.registerCommand(["B站解析","b站解析"], CommandBilibiliDownload.get());
    instance.registerCommand(["水晶球"], CommandCrystalBall.get());
    instance.registerCommand(["球面化"], CommandSpherization.get());
    instance.registerCommand(["逆球面化"], CommandDespherization.get());
    instance.registerCommand(["我巨爽"], CommandIMSoHappy.get());
    instance.registerCommand(["旅行伙伴加入"], CommandMaiFriend.get());
    instance.registerCommand(["旅行伙伴觉醒"], CommandMaiAwake.get());
  }
}
