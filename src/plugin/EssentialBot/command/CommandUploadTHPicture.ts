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
import {PromptProxy} from "../../../core/utils/PromptProxy";

interface th_pic {
  pic_id: number;
  upload: string;
}

interface th_pic_upload_history {
  histories: th_pic[];
}

export class CommandUploadTHPicture {
  public config: Config<th_pic_upload_history> = <Config<th_pic_upload_history>>Config.createConfig('th_pic_upload_history', {
    histories: []
  }, true);
  private url = path.resolve(path.join(Utils.getRoot(), 'assets', 'touhou_pic'));

  public root = new CommandProvider()
    .requires(async (session) =>
      await session.hasPermissionLevel(1) ||
      await session.hasPermission("upload") ||
      await session.hasGroupPermission(1)
    )
    .addOptionalArgument("图片", "pic", null)
    .onExecute(async (session, args) => {
      await session.sendQueued('请发送需要上传的图片，输入 `.cancel` 取消');

      const nexts = await PromptProxy.prompt(session, args.get("pic"), 30000);
      if (!nexts) {
        return await Messages.sendMessageToReply(session, "输入超时。");
      }

      const nextElements = h.parse(nexts);
      const imageElements = nextElements.filter(e => e.type === 'img');

      if (imageElements.length === 0) {
        return await Messages.sendMessageToReply(session, "未检测到图片，请重新发送。");
      }

      let successCount = 0;
      let failCount = 0;

      try {
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

        let message = `上传完成: 成功 ${successCount} 张`;
        if (failCount > 0) message += `，失败 ${failCount} 张`;
        await Messages.sendMessage(session, message);

      } catch (err) {
        LOGGER.error("图片上传过程中出现异常:", err);
        await Messages.sendMessage(session, "图片上传失败，请稍后重试");
      }
    });

  public static get(): CommandProvider {
    const instance = new this();
    return instance.root;
  }
}
