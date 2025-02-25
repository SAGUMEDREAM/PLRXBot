import {Dict, h, Session} from "koishi";
import {botOptional} from "../../index";
import {Messages} from "./Messages";
import {MIMEUtils} from "../utils/MIMEUtils";

export class MessageMerging {
  private messageList = [];
  private session: Session<any, any, any>;
  private attrs: Dict<any, string> = {}

  private constructor(session: Session<any, any, any> | null) {
    if (session != null) {
      this.session = session;
      this.attrs = {
        userId: this?.session?.selfId,
        nickname: this?.session?.author?.name || this?.session?.username,
      }
    } else {
      this.session = null;
      this.attrs = {
        userId: botOptional?.value?.selfId,
        nickname: botOptional?.value?.user?.name || botOptional?.value?.user?.name,
      }
    }
  }

  public static createBuilder(session: Session<any, any, any> | null): MessageMerging {
    return new MessageMerging(session);
  }

  public static async ofArray(session: Session<any, any, any> | null, arr: any[], lBreak: boolean = false): Promise<h> {
    const builder = this.createBuilder(session);
    for (const arrElement of arr) {
      builder.put(arrElement, lBreak);
    }
    const h1: h = await builder.get();
    return h1;
  }

  public includes(str: string): boolean {
    return this.messageList.includes(str);
  }

  public put(message: any, lBreak: boolean = false): MessageMerging {
    if (lBreak == true) {
      if (typeof message == 'string' && message.includes("\n") == false) {
        message += "\n";
      }
    }
    this.messageList.push(message);
    return this;
  }

  public async get(notSupport: boolean = false): Promise<h> {
    const isNotSupport = notSupport == true || this.session.platform == "qq" || this.session.platform == "qqguild";
    const messageList = [];
    if (isNotSupport) {
      messageList.push("**合并转发**\n");
      for (const message of this.messageList) {
        messageList.push(`> ${message}\n`)
      }
      return await Messages.markdown(messageList);
    } else {
      for (const message of this.messageList) {
        messageList.push(h('message', message));
      }
      return h('message', {forward: true}, messageList);
    }
  }

  public clear(): void {
    this.messageList = [];
  }

  public length(): number {
    return this.messageList.length;
  }

  public async asString(): Promise<string> {
    return (await this.get()).toString();
  }

  public toString(): string {
    return this.messageList.toString();
  }
}
