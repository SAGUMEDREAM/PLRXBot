import {PluginInitialization} from "../PluginInitialization";
import {exec} from "child_process";
import os from "os";

export class PythonSupport extends PluginInitialization {
  public static INSTANCE: PythonSupport;
  constructor() {
    super("python");
    PythonSupport.INSTANCE = this;
  }

  public load(): void {
    this.isRunning().then(isRunning => {
      if(!isRunning) {
        this.pluginLogger.warn(`Detected that the Python service is not running and the service is unavailable`);
      }
    });
  }

  public async isRunning(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const command = os.platform() === "win32"
        ? "tasklist | findstr python"
        : "ps aux | grep '[p]ython'";

      exec(command, (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }
        resolve(stdout.trim().length > 0);
      });
    });
  }
}
