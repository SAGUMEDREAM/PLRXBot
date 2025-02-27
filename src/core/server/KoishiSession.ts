import {Client} from "@koishijs/console";

export interface Message {
  id: string
  user: string
  channel: string
  content: string
  platform: string
  quote?: Message
}

export class KoishiSession {
  public static createSession(platform: string, userId: string, channel: string, content: string, quote: Message | undefined) {
    const session = new KoishiSession();
    return session;
  }
}
