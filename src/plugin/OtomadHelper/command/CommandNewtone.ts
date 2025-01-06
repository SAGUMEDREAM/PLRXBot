import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MessageMerging} from "../../../core/network/MessageMerging";
import {h} from "koishi";
import request, {FormData, Options} from "sync-request";
import {Constant} from "../../../core/Constant";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import fs from "fs";
import {Files} from "../../../core/utils/Files";

export class CommandNewtone {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      await session.sendQueued(h('quote', {id: session.messageId}) + "请发送待修音的文件");
      let file = await session.prompt();
      if (!file) {
        return session.sendQueued("输入超时");
      }
      file = file.toString();
      const match = file.match(/file-id="\/?([^"]+)"/);
      const fileId: string | null = "/" + match[1];
      let requests = await session["onebot"]._request('get_file',{file_id: fileId});
      let { status, retcode, data, message } = requests;
      if (status != "ok" || retcode !== 0) {
        return session.sendQueued(`获取文件失败: 未知错误`);
      }
      let url = data["url"];
      let size = data["size"];
      let filename = data["file_name"];

      if (size > 3 * 1024 * 1024) {
        return session.sendQueued("文件超过3MB，无法处理");
      }

      let fileExtension = filename.split('.').pop().toLowerCase();
      let audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
      let fileNameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));

      if (!audioExtensions.includes(fileExtension)) {
        return session.sendQueued("输入的不是音频文件");
      }

      let api = "http://localhost:8099/xiuyin"
      let fd: FormData = new FormData();
      fd.append("url", url)

      let options: Options = {
        form: fd,
      }
      let res = request("POST", api, options);
      let body: any = res.getBody();
      let buffer: Buffer = body;
      let saved_path = path.join(Utils.getRoot(), 'data', 'caches', `${fileNameWithoutExtension}_c.${fileExtension}`);
      await fs.promises.writeFile(saved_path, buffer);
      await session.sendQueued(h('file', {
        src: `file://${saved_path}`,
        title: `${fileNameWithoutExtension}_c.${fileExtension}`
      }));
      Files.delete(saved_path);
    });

  public static get(): CommandProvider {
    let instance = new this();
    return instance.root;
  }
}
