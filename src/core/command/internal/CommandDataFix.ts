import {CommandProvider} from "../CommandProvider";
import {UserManager} from "../../user/UserManager";
import path from "path";
import {UserInfo} from "../../user/UserInfo";
import {Messages} from "../../network/Messages";
import {Constant} from "../../Constant";
import fs from 'fs/promises';

export class CommandDataFix {
  public readonly fix = new CommandProvider()
    .onExecute(async (session, args) => {
      const userDataPath = UserManager.getDataPath();

      try {
        let files = await fs.readdir(userDataPath);
        let jsonFiles = files.map(filename => path.join(userDataPath, filename))
          .filter(file => path.extname(file) === '.json');

        let invalidFiles: string[] = [];

        await Promise.all(jsonFiles.map(async (file) => {
          try {
            const data = await fs.readFile(file, 'utf8');
            JSON.parse(data);
          } catch (error) {
            invalidFiles.push(file);
            await fs.unlink(file);
          }
        }));

        await Promise.all(files.map(async (file) => {
          const user_id = path.basename(file, '.json');
          const user = await UserInfo.getConstructor(path.join(userDataPath, file));

          user.dataFixer();
          await user.save();
        }));

        let message = "数据修复成功";
        if (invalidFiles.length > 0) {
          message += "\n删除的错误文件:\n" + invalidFiles.join("\n");
        }

        await Messages.sendMessageToReply(session, message);
      } catch (err) {
        await Messages.sendMessageToReply(session, "数据修复失败: " + err.message);
      }
    });

  public readonly test = new CommandProvider()
    .onExecute(async (session, args) => {
      const directory = Constant.USER_DATA_PATH;

      try {
        let files = await fs.readdir(directory);
        let jsonFiles = files.map(filename => path.join(directory, filename))
          .filter(file => path.extname(file) === '.json');

        let invalidFiles: string[] = [];

        await Promise.all(jsonFiles.map(async (file) => {
          try {
            const data = await fs.readFile(file, 'utf8');
            JSON.parse(data);
          } catch (error) {
            invalidFiles.push(file);
          }
        }));

        let result = invalidFiles.length > 0
          ? "错误文件:\n" + invalidFiles.join("\n")
          : "没有发现错误文件";

        await Messages.sendMessageToReply(session, result);
      } catch (err) {
        await Messages.sendMessageToReply(session, "检查失败: " + err.message);
      }
    });

  public readonly root = new CommandProvider()
    .requires(async (session) => await session.hasPermissionLevel(4))
    .onExecute(CommandProvider.leakArgs)
    .addSubCommand("fix", this.fix)
    .addSubCommand("test", this.test);

  public static get(): CommandProvider {
    return new this().root;
  }
}
