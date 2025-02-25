import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import os from 'os';
import {exec} from 'child_process';

export class CommandOS {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      let mdList = [];
      let osType = os.type();
      let osRelease = os.release();
      let osPlatform = os.platform();
      let osArch = os.arch();
      let totalMem = os.totalmem() / (1024 * 1024 * 1024);
      let freeMem = os.freemem() / (1024 * 1024 * 1024);
      let usedMem = totalMem - freeMem;
      const cpuUsage = await this.getCPUUsage();
      const diskUsage = await this.getDiskUsage();

      mdList.push("# 蓬莱人形Bot运行状况")
      mdList.push('## 系统信息\n');
      mdList.push(`CPU 型号：${this.getCpuName()}\n\n`);
      mdList.push(`CPU 使用率：${cpuUsage.toFixed(2)}%\n\n`);
      mdList.push(`操作系统：${osType} ${osRelease} (${osPlatform}) ${osArch}\n\n`);
      mdList.push(`开机时间：${this.getBootTime()}\n\n`);
      mdList.push(`内存: 已用 ${usedMem.toFixed(1)}/${totalMem.toFixed(1)} GB\n\n`);
      mdList.push(`### 磁盘使用情况\n`);
      for (const disk of diskUsage) {
        const total = disk.total;
        const usedPercentage = Number(((disk.used / total) * 100).toFixed(2)); // 已用百分比，保留两位小数
        const freePercentage = Number((100 - usedPercentage).toFixed(2));      // 空闲百分比
        mdList.push(`* 磁盘${disk.drive} ${disk.used}/${disk.total} GB\n\n`);
      }

      await Messages.sendMessageToReply(session, await Messages.markdown(mdList));
    });

  public static get(): CommandProvider {
    return new this().root;
  }

  private getBootTime() {
    const uptimeInSeconds = os.uptime();

    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
  }

  private getCpuName() {
    const cpus = os.cpus();
    if (cpus.length > 0) {
      return cpus[0].model;
    }
    return "Unknown";
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

    return {idle, total};
  }

  private async getCPUUsage(): Promise<number> {
    if (os.platform() === 'win32') {
      return this.getCPUUsageWindows();
    } else {
      return this.getCPUUsageLinux();
    }
  }

  private async getCPUUsageWindows(): Promise<number> {
    return new Promise((resolve, reject) => {
      exec('wmic cpu get loadpercentage', (error, stdout) => {
        if (error) {
          reject('获取 CPU 信息失败');
        } else {
          const lines = stdout.trim().split('\n');
          const usage = parseFloat(lines[1]);
          resolve(usage);
        }
      });
    });
  }
  private async getCPUUsageLinux(): Promise<number> {
    return new Promise((resolve, reject) => {
      exec("top -bn1 | grep 'Cpu(s)' | awk '{print $2 + $4}'", (error, stdout) => {
        if (error) {
          reject('获取 CPU 信息失败');
        } else {
          resolve(parseFloat(stdout.trim()));
        }
      });
    });
  }


  private getDiskUsageWindows(): Promise<any> {
    return new Promise((resolve, reject) => {
      exec('wmic logicaldisk get size,freespace,caption', (error, stdout, stderr) => {
        if (error || stderr) {
          reject('获取磁盘信息失败');
        } else {
          const lines = stdout.trim().split('\n').slice(1);
          let diskInfo = [];
          lines.forEach(line => {
            const [drive, freeSpace, size] = line.trim().split(/\s+/);
            const usedSpace = (parseInt(size) - parseInt(freeSpace)) / (1024 * 1024 * 1024);
            const totalSize = parseInt(size) / (1024 * 1024 * 1024);
            diskInfo.push({drive: drive, used: usedSpace.toFixed(1), total: totalSize.toFixed(1)})
          });
          resolve(diskInfo);
        }
      });
    });
  }

  private getDiskUsageLinux(): Promise<any> {
    return new Promise((resolve, reject) => {
      exec('df -h --output=source,used,size', (error, stdout, stderr) => {
        if (error || stderr) {
          reject('获取磁盘信息失败');
        } else {
          const lines = stdout.trim().split('\n').slice(1);
          let diskInfo = [];
          lines.forEach(line => {
            const [drive, usedSpace, totalSize] = line.trim().split(/\s+/);
            diskInfo.push({drive: drive, used: usedSpace, total: totalSize})
          });
          resolve(diskInfo);
        }
      });
    });
  }

  private getDiskUsage(): Promise<any> {
    if (os.platform() === 'win32') {
      return this.getDiskUsageWindows();
    } else {
      return this.getDiskUsageLinux();
    }
  }
}
