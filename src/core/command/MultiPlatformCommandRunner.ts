import {Context, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {CommandArgs} from "./CommandArgs";

export type MultiRunnable =
  | ((session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => void)
  | ((session: Session<User.Field, Channel.Field, Context>, args: CommandArgs) => Promise<void>);

export class MultiPlatformCommandRunner {
  private optional: { [platform: string]: MultiRunnable } = {};

  private constructor() {
  }

  public thenFor(platform: string = "common", fn: MultiRunnable): MultiPlatformCommandRunner {
    if (platform == null) {
      platform = "common";
    }
    this.optional[platform] = fn;
    return this;
  }

  public async run(session: Session<User.Field, Channel.Field, Context>, args: CommandArgs): Promise<MultiPlatformCommandRunner> {
    const platform: string = session.platform;
    const commonFn: MultiRunnable = this.optional["common"];
    const platformFn: MultiRunnable = this.optional[platform];

    if (platformFn != null && typeof platformFn == "function") {
      await this.shell(platformFn, session, args);
    } else if (typeof commonFn == "function") {
      await this.shell(commonFn, session, args);
    }

    return this;
  }

  private async shell(fn: MultiRunnable, session: Session<User.Field, Channel.Field, Context>, args: CommandArgs): Promise<any> {
    const isAsync: boolean = fn.constructor.name == "AsyncFunction";
    if (isAsync) {
      return await fn(session, args);
    } else {
      return fn(session, args);
    }
  }

  public static get(): MultiPlatformCommandRunner {
    return new MultiPlatformCommandRunner();
  }
}
