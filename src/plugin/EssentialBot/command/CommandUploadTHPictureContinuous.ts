import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {h} from "koishi";
import path from "path";
import {Utils} from "../../../core/utils/Utils";
import axios from "axios";
import {KoishiImages} from "../../../core/network/KoishiImages";
import {MIMEUtils} from "../../../core/utils/MIMEUtils";
import {LOGGER} from "../../../index";
import {Config} from "../../../core/data/Config";

interface th_pic {
  pic_id: number;
  upload: string;
}

interface th_pic_upload_history {
  histories: th_pic[];
}

export class CommandUploadTHPictureContinuous {
  public config: Config<th_pic_upload_history> = <Config<th_pic_upload_history>>Config.createConfig('th_pic_upload_history', {
    histories: []
  }, true);
  private url = path.resolve(path.join(Utils.getRoot(), 'assets', 'touhou_pic'));

  public root = new CommandProvider()
    .requires(session =>
      session.hasPermissionLevel(1) ||
      session.hasPermission("upload") ||
      session.hasGroupPermission(1)
    )
    .onExecute(async (session, args) => {
      let successCount = 0;
      let failCount = 0;

      // 开始循环，直到满足退出条件
      while (true) {
        await session.sendQueued('请发送需要上传的图片，输入 `.cancel` 取消');

        const nexts = await session.prompt(30000);
        if (!nexts) {
          return Messages.sendMessageToReply(session, "输入超时。");
        }

        // 如果用户输入 `.cancel`，退出上传
        if (nexts.trim().toLowerCase() === ".cancel") {
          return Messages.sendMessageToReply(session, "上传已取消");
        }

        const nextElements = h.parse(nexts);
        const imageElements = nextElements.filter(e => e.type === 'img');

        // 如果没有图片，退出上传
        if (imageElements.length === 0) {
          return Messages.sendMessageToReply(session, "未检测到图片，请重新发送，或者输入 `.cancel` 取消上传。");
        }

        // 处理每一张图片
        await Promise.all(imageElements.map(async (img) => {
          try {
            const koishiImg = new KoishiImages();
            koishiImg.file = img.attrs.file;
            koishiImg.src = img.attrs.src;

            const response = await axios.get(koishiImg.src, { responseType: 'arraybuffer' });
            koishiImg.buffer = Buffer.from(response.data);
            koishiImg.mime_type = MIMEUtils.getType(koishiImg.buffer);

            const result = await koishiImg.saveToPath(this.url);
            if (result.success) {
              successCount++;

              const newHistory: th_pic = {
                pic_id: parseInt(result.fileName.split('.')[0], 10),
                upload: session.userId
              };

              this.config.getConfig().histories.push(newHistory);
            } else {
              failCount++;
            }

          } catch (error) {
            LOGGER.error(`图片下载或保存失败: ${img.attrs.src}`, error);
            failCount++;
          } finally {
            this.config.save();
          }
        }));

        // 每次上传后给出反馈
        let message = `上传完成: 成功 ${successCount} 张`;
        if (failCount > 0) message += `，失败 ${failCount} 张`;
        Messages.sendMessage(session, message);

        // 用户如果继续上传图片，循环继续
        // 如果用户不再发送图片或发的是非图片内容，结束循环
        const continueUpload = await session.prompt(15000);
        if (!continueUpload || continueUpload.trim().toLowerCase() === ".cancel") {
          Messages.sendMessage(session, '上传会话关闭');
          break;
        }
      }
    });

  public static get(): CommandProvider {
    const instance = new this();
    return instance.root;
  }
}
