import { CommandProvider } from "../../../core/command/CommandProvider";
import { Messages } from "../../../core/network/Messages";
import os from 'os';
import { exec } from 'child_process';

export class CommandOS {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      let result = '系统信息:\n';
      let osType = os.type();
      let osRelease = os.release();
      let osPlatform = os.platform();
      let osArch = os.arch();
      let totalMem = os.totalmem() / (1024 * 1024 * 1024);
      let freeMem = os.freemem() / (1024 * 1024 * 1024);
      let usedMem = totalMem - freeMem;
      const cpuUsage = await this.getCPUUsage();
      const diskUsage = await this.getDiskUsage();

      result += `🖥️ 操作系统: ${osType} ${osRelease} (${osPlatform}) ${osArch}\n`;
      result += `💻 CPU 使用率: ${cpuUsage.toFixed(2)}%\n`;
      result += `💾 内存: 已用 ${usedMem.toFixed(1)}/${totalMem.toFixed(1)} GB\n`;
      result += `💽 磁盘使用情况: \n${diskUsage}\n`;

      Messages.sendMessageToReply(session, result);
    });

  public static get(): CommandProvider {
    return new this().root;
  }

  private getCpuTimes() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        total += cpu.times[type as keyof typeof cpu.times];
      }
      idle += cpu.times.idle;
    });

    return { idle, total };
  }

  private async getCPUUsage() {
    const start = this.getCpuTimes();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const end = this.getCpuTimes();

    const idleDifference = end.idle - start.idle;
    const totalDifference = end.total - start.total;
    const usage = (1 - idleDifference / totalDifference) * 100;

    return usage;
  }

  private getDiskUsageWindows(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec('wmic logicaldisk get size,freespace,caption', (error, stdout, stderr) => {
        if (error || stderr) {
          reject('获取磁盘信息失败');
        } else {
          const lines = stdout.trim().split('\n').slice(1);
          let diskInfo = '';
          lines.forEach(line => {
            const [drive, freeSpace, size] = line.trim().split(/\s+/);
            const usedSpace = (parseInt(size) - parseInt(freeSpace)) / (1024 * 1024 * 1024);
            const totalSize = parseInt(size) / (1024 * 1024 * 1024);
            diskInfo += `- [${drive}]: ${usedSpace.toFixed(1)}/${totalSize.toFixed(1)} GB\n`;
          });
          resolve(diskInfo);
        }
      });
    });
  }

  private getDiskUsageLinux(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec('df -h --output=source,used,size', (error, stdout, stderr) => {
        if (error || stderr) {
          reject('获取磁盘信息失败');
        } else {
          const lines = stdout.trim().split('\n').slice(1);
          let diskInfo = '';
          lines.forEach(line => {
            const [drive, usedSpace, totalSize] = line.trim().split(/\s+/);
            diskInfo += `${drive}: ${usedSpace} / ${totalSize}\n`;
          });
          resolve(diskInfo);
        }
      });
    });
  }

  private getDiskUsage(): Promise<string> {
    if (os.platform() === 'win32') {
      return this.getDiskUsageWindows();
    } else {
      return this.getDiskUsageLinux();
    }
  }
}
