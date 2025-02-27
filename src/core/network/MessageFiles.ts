import {Context, h, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {Files} from "../utils/Files";
import fs from "fs";
import axios from "axios";

export enum FileState {
  OK,
  ERROR
}

export abstract class FileInfo {
  name: string;
  size: number;
  src: string;
  buffer: Buffer;
}

export abstract class FileResult {
  abstract state: FileState;
  abstract message: string;
  abstract data: FileInfo | null;
}

export class MessageFiles {

  public static getFile(path: string, file_name: string): h {
    return h('file', {
      src: `file://${path}`,
      title: `${file_name}`,
    })
  }

  public static saveToPath(buffer: Buffer, path: string) {

  }

  public static deleteBuffer(result: FileResult): boolean {
    if (!result || !result.data) {
      return false;
    }
    return Files.delete(result.data.src);
  }

  public static async getBuffer(session: Session<User.Field, Channel.Field, Context>, content: string): Promise<FileResult> {
    if (!content) {
      return { state: FileState.ERROR, message: "输入超时", data: null };
    }

    const elements = h.parse(String(content));
    const fileInfo: FileInfo = {
      name: "",
      size: 0,
      src: "",
      buffer: null,
    } as FileInfo;

    const fileIdElement = elements.find((el) => el.type === 'file');
    if (!fileIdElement) {
      return { state: FileState.ERROR, message: "没有找到文件", data: null };
    }

    const fileId = fileIdElement.attrs['file-id'] || fileIdElement.attrs['fileId'];
    if (!fileId) {
      return { state: FileState.ERROR, message: "没有找到文件 ID", data: null };
    }

    try {
      const requests = await session["onebot"]._request('get_file', { file_id: fileId });
      const status = requests["status"];
      const retcode = requests["retcode"];
      const data = requests["data"];
      const message = requests["message"];

      if (status !== "ok" || retcode !== 0) {
        return { state: FileState.ERROR, message: `获取文件失败: ${message || "未知错误"}`, data: null };
      }

      const url = data["url"];
      const size = data["size"];
      const filename = data["file_name"];

      let buffer: Buffer;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        buffer = await this.downloadFile(url);
      } else {
        buffer = fs.readFileSync(url);
      }

      fileInfo.size = size;
      fileInfo.name = filename;
      fileInfo.src = url;
      fileInfo.buffer = buffer;

      return { state: FileState.OK, message: `获取成功`, data: fileInfo };

    } catch (err) {
      return { state: FileState.ERROR, message: `获取文件失败: ${err.message}`, data: null };
    }
  }

  private static async downloadFile(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (err) {
      throw new Error(`下载文件失败: ${err.message}`);
    }
  }
}
