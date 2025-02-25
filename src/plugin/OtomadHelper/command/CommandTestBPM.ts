import {CommandProvider} from "../../../core/command/CommandProvider";
import {h} from "koishi";
import path from "path";
import FormData from "form-data";
import axios from 'axios';
import {OtomadHelper} from "../index";
import {Messages} from "../../../core/network/Messages";
import {Files} from "../../../core/utils/Files";

export class CommandTestBPM {
  public root: CommandProvider = new CommandProvider()
    .platform("onebot")
    .onExecute(async (session, args) => {
      await session.sendQueued(h('quote', { id: session.messageId }) + "请发送待测试的文件");
      const file = await session.prompt(30000);
      if (!file) {
        return session.sendQueued("输入超时");
      }

      const parsed = h.parse(file.toString());

      const fileIdElement = parsed.find((el: any) => el.type === 'file');
      if (!fileIdElement) {
        return session.sendQueued("没有找到文件");
      }

      const fileId = fileIdElement.attrs['file-id'] || fileIdElement.attrs['fileId'];
      if (!fileId) {
        return session.sendQueued("没有找到文件 ID");
      }

      try {
        const requests = await session.onebot._request('get_file', { file_id: fileId });
        const { status, retcode, data } = requests;
        const message = requests["message"];

        if (status !== "ok" || retcode !== 0) {
          return session.sendQueued(`获取文件失败: ${message || "未知错误"}`);
        }

        const url = data["url"];
        const size = data["size"];
        const filename = data["file_name"];

        if (size > 20 * 1024 * 1024) {
          return session.sendQueued("文件超过20MB，无法处理");
        }

        const fileExtension = filename.split('.').pop()?.toLowerCase();
        const audioExtensions: string[] = ['wav','wave'];

        if (!audioExtensions.includes(fileExtension || '')) {
          return session.sendQueued("只支持上传wav文件!");
        }

        const bpm = await this.detectWav(path.resolve(url));
        if (bpm) {
          await Messages.sendMessageToReply(session, `检测到的BPM: ${bpm}`);
        } else {
          await Messages.sendMessageToReply(session, "无法检测到BPM");
        }

        Files.delete(url);
      } catch (err) {
        OtomadHelper.INSTANCE.pluginLogger.error(err);
        await session.sendQueued("文件处理失败");
      }
    }).platform("onebot");
  private async detectWav(path: string) {
    const api = "http://localhost:8099/bpmtest";
    const formData = new FormData();
    formData.append("path", path);

    try {
      const response = await axios.post(api, formData, {
        headers: formData.getHeaders(),
        responseType: 'json',
      });

      return response.data["bpm"];
    } catch (error) {
      OtomadHelper.INSTANCE.pluginLogger.error(error)
      return null;
    }
  }
  public static get(): CommandProvider {
    const instance = new this();
    return instance.root;
  }
}
