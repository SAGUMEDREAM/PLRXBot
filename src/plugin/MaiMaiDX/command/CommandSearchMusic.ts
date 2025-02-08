import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MaiMaiDX} from "../index";
import {music_chart, MusicData} from "../data/MusicData";

export class CommandSearchMusic {
  private root = new CommandProvider()
    .addRequiredArgument("歌名", "name")
    .onExecute(async (session, args) => {
      let name = args.getArgumentsString();
      if (!name) {
        Messages.sendMessageToReply(session, "缺少参数");
        return;
      }

      name = name.toLowerCase();

      let resultName: Set<string> = new Set();
      let resultId: Set<string> = new Set();

      for (const aliasArray of MaiMaiDX.INSTANCE.alias) {
        if (aliasArray.some((alias: string) => alias.toLowerCase().includes(name))) {
          resultName.add(aliasArray[0]);
        }
      }

      for (const songName of resultName) {
        const musicData = MaiMaiDX.INSTANCE.optional.list.getByName(songName);
        if (musicData) resultId.add(musicData.music_id);
      }

      MaiMaiDX.INSTANCE.optional.list.values.forEach((musicData: MusicData) => {
        const basicInfo = musicData.data.basic_info;
        const matchesArtist = basicInfo.artist.toLowerCase().includes(name);
        const matchesGenre = basicInfo.genre.toLowerCase().includes(name);
        const matchesId = musicData.music_id.toLowerCase() === name;

        if (matchesArtist || matchesGenre || matchesId) {
          resultId.add(musicData.music_id);
        }
      });

      async function generateMarkdown(resultIds: Set<string>) {
        const markdownList = [];
        markdownList.push("## 搜索结果\n");

        if (resultIds.size === 0) {
          markdownList.push("未找到匹配的歌曲\n");
        } else {
          markdownList.push(`找到 ${resultIds.size} 首歌曲：\n`);
          let i = 1;
          for (const id of resultIds) {
            // console.log(id)
            if (i > 13) {
              markdownList.push(`剩余 ${resultIds.size - 13} 个结果未显示...\n`);
              break;
            }
            const musicData = MaiMaiDX.INSTANCE.optional.list.values.get(id);
            if (musicData != null) {
              markdownList.push(`* ${musicData.data.title}\n`);
              markdownList.push(`    * 歌曲ID: ${musicData.music_id}\n`);
              markdownList.push(`    * 艺术家: ${musicData.data.basic_info.artist}\n`);
              markdownList.push(`    * bpm: ${musicData.data.basic_info.bpm}\n`);
              markdownList.push(`    * 分区: ${musicData.data.basic_info.genre}\n`);
              i++;
            }
          }
        }

        return await Messages.getMarkdown(markdownList);
      }

      const markdownBuffer = await generateMarkdown(resultId);
      Messages.sendMessageToReply(session, markdownBuffer);

    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
