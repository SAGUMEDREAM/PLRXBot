import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {OtomadHelper} from "../index";
import axios from "axios";
import * as cheerio from 'cheerio';

export class CommandRandomTutorial {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      try {
        const { data } = await axios.get('https://otomad.wiki/%E5%88%B6%E4%BD%9C%E6%95%99%E7%A8%8B');
        const $ = cheerio.load(data);
        const links = [];

        $('.mw-body a').each((i, element) => {
          const href = $(element).attr('href');
          if (href && !href.includes('#')) {
            links.push(href);
          }
        });

        let selected = links[Math.floor(Math.random() * links.length)];
        if (selected[0] === '/') {
          selected = 'https://otomad.wiki' + selected;
        }
        Messages.sendMessage(session, selected);
      } catch (err) {
        OtomadHelper.INSTANCE.pluginLogger.error(err);
        Messages.sendMessageToReply(session, "请求失败");
      }
    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
