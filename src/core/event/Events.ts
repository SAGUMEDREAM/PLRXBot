import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../user/UserManager";
import {LOGGER} from "../../index";

export class Events {
  public static readonly EVENTS: Map<string, Function> = new Map<string, Function>();

  public static init(): void {
    LOGGER.info("Loading Events...")
    this.register("next_message", (args: any) => {
      const session: Session<User.Field, Channel.Field, Context> = args;
      const user = UserManager.get(session);

    });
  }

  public static callEvent(identifier: string, args: any): any {
    try {
      return this.EVENTS.get(identifier)(args);
    } catch (e) {
      return null;
    }
  }

  public static register(identifier: string, callback: (args: any) => any): void {
    this.EVENTS.set(identifier, callback);
  }

  public static unregister(identifier: string): void {
    this.EVENTS.delete(identifier);
  }
}
