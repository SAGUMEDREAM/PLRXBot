import {Session} from "koishi";

export class PlatformUtils {
  public static isQQ(session: Session): boolean {
    return session.platform == "qq" || session.platform == "qqguild";
  }

  public static isOneBot(session: Session): boolean {
    return session.platform == "onebot";
  }
}
