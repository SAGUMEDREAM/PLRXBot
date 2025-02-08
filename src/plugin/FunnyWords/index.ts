import {PluginInitialization} from "../../core/plugins/PluginInitialization";
import {CommandManager} from "../../core/command/CommandManager";
import {CommandWeirdSay} from "./command/CommandWeirdSay";
import {Files} from "../../core/utils/Files";
import path from "path";
import {Utils} from "../../core/utils/Utils";
import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {PluginEvent} from "../../core/plugins/PluginEvent";
import {PluginListener} from "../../core/plugins/PluginListener";

export type FWMessage = {
  userId: string;
  msg: string;
};

export class FunnyWords extends PluginInitialization {
  constructor() {
    super("funny_words");
    FunnyWords.INSTANCE = this;
  }

  public static readonly message_db_path = path.resolve(path.join(Utils.getRoot(), 'data', 'caches'), "message_db.json");
  public static MESSAGE_DB: FWMessage[] = [];
  public static INSTANCE: FunnyWords;
  public counter: number = 0;
  public enabled = false;

  private loadData() {
    try {
      FunnyWords.MESSAGE_DB = JSON.parse(Files.read(FunnyWords.message_db_path));
      this.saveData();
    } catch (e) {
      FunnyWords.MESSAGE_DB = [];
      this.saveData();
    }
  }

  public load(): void {
    const instance = CommandManager.getInstance();
    instance.registerCommand(["说怪话"], CommandWeirdSay.get());
    this.loadData();

    PluginListener.on(PluginEvent.HANDLE_MESSAGE, this, (session, args) => {
      let content = session.content;
      if (CommandManager.getInstance().testCommand(content, session)) return;
      if (!this.enabled) return;
      this.parseMsg(session);
    });

    this.saveData();
  }

  public isMedia(session: Session<User.Field, Channel.Field, Context>): boolean {
    try {
      let content = session.content;
      return content.includes("<img src=") || content.includes("<video src=") || content.includes("<at id=");
    } catch (err) {
      return false;
    }
  }

  public parseMsg(session: Session<User.Field, Channel.Field, Context>): void {
    if(session.userId == session.selfId) return;
    if(this.isMedia(session)) return;
    FunnyWords.MESSAGE_DB.push({
      userId: session.userId,
      msg: session.content
    });
    this.counter++;
    if (this.counter >= 8) {
      this.saveData();
      this.counter = 0;
    }
  }

  public saveData() {
    Files.write(FunnyWords.message_db_path, JSON.stringify(FunnyWords.MESSAGE_DB, null, 2));
  }
}
