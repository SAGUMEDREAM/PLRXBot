import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {h} from "koishi";
import {MusicData} from "../data/MusicData";
import axios from "axios";

export class CommandPlayMusic {
  private root = new CommandProvider()
    .addRequiredArgument("歌名", "name")
    .onExecute(async (session, args) => {
      const name = args.getArgumentsString();
      const instance = MaiMaiDX.INSTANCE;
      let music_data: MusicData = instance.optional.list.getByName(name) || instance.optional.list.getById(name);
      if (music_data == null) {
        await Messages.sendMessageToReply(session, "点歌失败");
        return;
      }

      try {
        const res = await axios.get(`https://assets2.lxns.net/maimai/music/${music_data.music_id}.mp3`, {
          responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(res.data);
        let hh: any = h.audio(buffer, 'audio/mpeg');
        await Messages.sendMessage(session, hh);
      } catch (error) {
        instance.pluginLogger.error(error);
        await Messages.sendMessageToReply(session, "点歌失败");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
