import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {OtomadHelper} from "../index";
import axios from "axios";
import * as cheerio from 'cheerio';
import {MessageMerging} from "../../../core/network/MessageMerging";

export const OutputLength = 8;

export class CommandMidiShow {
  public root = new CommandProvider()
    .addRequiredArgument("关键词", "keyword")
    .onExecute(async (session, args) => {
      try {
        const keyword = args.get("keyword");
        const response = await axios.get(`https://www.midishow.com/search/result?q=${encodeURIComponent(keyword)}`, {
          headers: {
            'Referer': 'https://www.midishow.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          }
        });

        if (response.status === 200) {
          const $ = cheerio.load(response.data);
          const results = $('#search-result > div');
          const resultText = $('.row .col-6 p').text().trim();
          const merging = MessageMerging.create(session);

          if (results.length === 0 || $(results[0]).attr('data-key') === '') {
            Messages.sendMessageToReply(session, "没有找到相关MIDI……");
          } else {
            results.slice(0, OutputLength).each((index, result) => {
              const title = $(result).find('.text-hover-primary').text().trim();
              const uploader = $(result).find('.avatar-img').attr('alt').trim();
              const duration = $(result).find('[title="乐曲时长"]').text().trim();
              const trackCount = $(result).find('[title="音轨数量"]').text().trim();
              const key = $(result).attr('data-key');

              const header = `MIDI 搜索结果:`
              const text = `标题: ${title}\n上传用户: ${uploader}\n乐曲时长: ${duration}\n音轨数量: ${trackCount}\n详细链接: https://www.midishow.com/midi/${key}.html`;
              if(!merging.includes(header)) merging.put(header);
              merging.put(text);
            });

            if(results.length > OutputLength) {
              const match = resultText.match(/\d+/);
              let max = results.length;
              let left = results.length - OutputLength;
              if (match) {
                const num = parseInt(match[0], 10);
                max = num;
                left = num - OutputLength;
              }
              merging.put(`一共 ${max} 个搜索结果\n剩余 ${left} 个结果未展示...`)
            }

            const mergedText = merging.get();
            Messages.sendMessage(session, mergedText);
          }
        } else {
          Messages.sendMessageToReply(session, "网络错误，MIDI搜索失败");
        }
      } catch (err) {
        OtomadHelper.INSTANCE.pluginLogger.error(err);
        Messages.sendMessageToReply(session, "网络错误，MIDI搜索失败");
      }
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
