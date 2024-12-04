import {Dict, h, Session} from "koishi";
import {Messages} from "./Messages";

export class MessageMerging {
  private lines = [];
  private session: Session<any, any, any>;
  private attrs: Dict<any, string> = {}
  private constructor(session: Session<any, any, any>) {
    this.session = session;
    this.attrs = {
      userId: this?.session?.selfId,
      nickname: this?.session?.author?.nickname || this?.session?.username,
    }
  }
  public static create(session: Session<any, any, any>): MessageMerging {
    return new MessageMerging(session);
  }
  public static merging(session: Session<any, any, any>, arr: any[], lBreak: boolean = false) {
    let merging = this.create(session);
    for (const arrElement of arr) {
      merging.put(arrElement, lBreak);
    }
    return merging.get();
  }

  public put(message: any, lBreak: boolean = false): MessageMerging {
    if(lBreak == true) {
      if(typeof message == 'string' && message.includes("\n") == false) {
        message += "\n";
      }
    }
    this.lines.push(message);
    return this;
  }
  public get(): h {
    let result = Messages.h('figure');
    for (const line of this.lines) {
      result.children.push(h('message', this.attrs, line));
    }
    return result;
  }
  public clear(): void {
    this.lines = [];
  }
  public length(): number {
    return this.lines.length;
  }
  public toString() {
    return this.get();
  }
}
