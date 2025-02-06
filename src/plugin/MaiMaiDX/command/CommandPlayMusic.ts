import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {h} from "koishi";
import {MusicData} from "../data/MusicData";
import axios from "axios";

export class CommandPlayMusic {
  private root = new CommandProvider()
    .addArg("歌名")
    .onExecute(async (session, args) => {
      const name = args.raw;
      const instance = MaiMaiDX.INSTANCE;
      if (name == null) {
        Messages.sendMessageToReply(session, "缺少参数");
        return;
      }
      let music_data: MusicData = instance.optional.list.getByName(name) || instance.optional.list.getById(name);
      if (music_data == null) {
        Messages.sendMessageToReply(session, "点歌失败");
        return;
      }

      try {
        const res = await axios.get(`https://assets2.lxns.net/maimai/music/${music_data.music_id}.mp3`, {
          responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(res.data);
        let hh: any = h.audio(buffer, 'audio/mpeg');
        Messages.sendMessage(session, hh);
      } catch (error) {
        instance.pluginLogger.error(error);
        Messages.sendMessageToReply(session, "点歌失败");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
