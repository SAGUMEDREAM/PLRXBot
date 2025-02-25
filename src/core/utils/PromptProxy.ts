import {Session} from "koishi";

export class PromptProxy {
  /**
   * 代理 prompt 方法，如果提供了默认值则直接返回，否则等待用户输入。
   * @param session Koishi 会话对象
   * @param defaultValue 默认值，如果为 null 或 undefined，则等待用户输入
   * @param timeout 等待用户输入的超时时间（毫秒），默认为 30000 毫秒
   * @returns 默认值或用户输入的值
   */
  public static async prompt(session: Session, defaultValue?: string, timeout: number = 30000): Promise<string> {
    return defaultValue ?? await session.prompt(timeout);
  }
}
