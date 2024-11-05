import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import os from 'os';  // 引入 os 模块

export class CommandOS {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let result = '系统信息:\n';
      let osType = os.type();
      let osRelease = os.release();
      let osPlatform = os.platform();
      let osArch = os.arch();
      let totalMem = os.totalmem() / (1024 * 1024 * 1024);
      let freeMem = os.freemem() / (1024 * 1024 * 1024);
      let usedMem = totalMem - freeMem;

      result += `操作系统: ${osType} ${osRelease} (${osPlatform}) ${osArch}\n`;
      result += `内存: ${usedMem.toFixed(2)}/${totalMem.toFixed(2)} GB\n`;

      Messages.sendMessageToReply(session,result);
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
