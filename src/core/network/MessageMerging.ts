import {Dict, h, Session} from "koishi";
import {botOptional} from "../../index";

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

  public static create(session: Session<any, any, any> | null): MessageMerging {
    return new MessageMerging(session);
  }

  public static merging(session: Session<any, any, any> | null, arr: any[], lBreak: boolean = false) {
    let merging = this.create(session);
    for (const arrElement of arr) {
      merging.put(arrElement, lBreak);
    }
    return merging.get();
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

  public get(): h {
    let messageList = [];
    for (const message of this.messageList) {
      messageList.push(h('message', message));
    }
    return h('message', {forward: true}, messageList);
  }

  public clear(): void {
    this.messageList = [];
  }

  public length(): number {
    return this.messageList.length;
  }

  public toString() {
    return this.get();
  }
}
