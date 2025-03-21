import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {h} from "koishi";
import {music_chart, MusicData} from "../data/MusicData";

export class CommandQueryMusic {
  private root = new CommandProvider()
    .addRequiredArgument("歌名", "name")
    .onExecute(async (session, args) => {
      const name = args.getArgumentsString();
      const music_data: MusicData = MaiMaiDX.INSTANCE.optional.list.getByName(name);
      if (music_data == null) {
        await Messages.sendMessageToReply(session, "查询失败");
        return;
      }

      let mdTexts = [
        `![歌曲封面](${music_data.getImageUrl()} "歌曲封面")\n`,
        `## ${music_data.data.title}\n`,
        `* 艺术家: ${music_data.data.basic_info.artist}\n`,
        `* 分区: ${music_data.data.basic_info.genre}\n`,
        `* bpm: ${music_data.data.basic_info.bpm}\n`,
        `\n`,
        `## 铺面数据\n`
      ]
      let levels: string[] = JSON.parse(JSON.stringify(music_data.data.level));
      let charts: music_chart[] = JSON.parse(JSON.stringify(music_data.data.charts));
      levels.reverse();
      charts.reverse();
      charts.forEach((chart: music_chart, index: number) => {
        let diff_l: string = 'UNKNOWN';
        if (charts.length == 5) {
          if (index == 0) diff_l = 'Re:MASTER';
          else if (index == 1) diff_l = 'MASTER';
          else if (index == 2) diff_l = 'EXPERT';
          else if (index == 3) diff_l = 'ADVANCED';
          else if (index == 4) diff_l = 'BASIC';
        } else {
          if (index == 0) diff_l = 'MASTER';
          else if (index == 1) diff_l = 'EXPERT';
          else if (index == 2) diff_l = 'ADVANCED';
          else if (index == 3) diff_l = 'BASIC';
        }

        mdTexts.push(`### ${diff_l} \n`);
        mdTexts.push(`* 难度: ${levels[index]}\n`);
        mdTexts.push(`* 谱师: ${chart.charter}\n`);
      });
      let buffer = await Messages.markdown(mdTexts);
      await Messages.sendMessageToReply(session, buffer);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
