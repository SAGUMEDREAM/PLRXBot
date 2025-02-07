import { CommandProvider } from "../../../core/command/CommandProvider";
import { h } from "koishi";
import axios from "axios";
import path from "path";
import { Utils } from "../../../core/utils/Utils";
import fs from "fs";
import { Files } from "../../../core/utils/Files";

export class CommandNewtone {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      await session.sendQueued(h('quote', { id: session.messageId }) + "请发送待修音的文件");
      const file = await session.prompt(30000);
      if (!file) {
        return session.sendQueued("输入超时");
      }

      const parsed = h.parse(file.toString());

      const fileIdElement = parsed.find((el) => el.type === 'file');
      if (!fileIdElement) {
        return session.sendQueued("没有找到文件");
      }

      const fileId = fileIdElement.attrs['file-id'] || fileIdElement.attrs['fileId'];
      if (!fileId) {
        return session.sendQueued("没有找到文件 ID");
      }

      try {
        const requests = await session["onebot"]._request('get_file', { file_id: fileId });
        const { status, retcode, data, message } = requests;

        if (status !== "ok" || retcode !== 0) {
          return session.sendQueued(`获取文件失败: ${message || "未知错误"}`);
        }

        const url = data["url"];
        const size = data["size"];
        const filename = data["file_name"];

        if (size > 3 * 1024 * 1024) {
          return session.sendQueued("文件超过3MB，无法处理");
        }

        const fileExtension = filename.split('.').pop().toLowerCase();
        const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
        const fileNameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));

        if (!audioExtensions.includes(fileExtension)) {
          return session.sendQueued("输入的不是音频文件");
        }

        const api = "http://localhost:8099/xiuyin";
        const formData = new FormData();
        formData.append("url", url);

        const response = await axios.post(api, formData, {
          responseType: 'arraybuffer',
        });

        const savedPath = path.join(Utils.getRoot(), 'data', 'caches', `${fileNameWithoutExtension}_c.${fileExtension}`);
        await fs.promises.writeFile(savedPath, response.data);

        await session.sendQueued(h('file', {
          src: `file://${savedPath}`,
          title: `${fileNameWithoutExtension}_c.${fileExtension}`,
        }));

        Files.delete(savedPath);
      } catch (error) {
        console.error("修音失败:", error);
        await session.sendQueued("修音失败，请稍后重试。");
      }
    });

  public static get(): CommandProvider {
    const instance = new this();
    return instance.root;
  }
}
