import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {h} from "koishi";
import {music_chart, MusicData} from "../data/MusicData";
import {Networks} from "../../../core/network/Networks";
import request from "sync-request";

export class CommandPlayMusic {
  private root = new CommandProvider()
    .addArg("歌名")
    .onExecute(async (session, args) => {
      let name = args.raw;
      if (name == null) {
        Messages.sendMessageToReply(session, "缺少参数");
        return;
      }
      let music_data: MusicData = MaiMaiDX.INSTANCE.optional.list.getByName(name);
      if (music_data == null) {
        Messages.sendMessageToReply(session, "点歌失败");
        return;
      }

      let res = request('GET', `https://assets2.lxns.net/maimai/music/${music_data.music_id}.mp3`, {});
      let body: Buffer | string = res.getBody();
      let buffer: any = body;
      let hh: any = h.audio(buffer, 'audio/mpeg');
      Messages.sendMessage(session, hh);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
