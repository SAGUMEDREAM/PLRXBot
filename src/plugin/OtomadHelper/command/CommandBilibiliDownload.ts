import {CommandProvider} from "../../../core/command/CommandProvider";
import {h} from "koishi";
import {Messages} from "../../../core/network/Messages";
import {Networks} from "../../../core/network/Networks";

export class CommandBilibiliDownload {
  public root = new CommandProvider()
    .addArg("BV号|AV号")
    .addArg("true|false")
    .onExecute(async (session, args) => {
      let biliVideoId = args.get(0);
      if (biliVideoId == null) {
        Messages.sendMessageToReply(session, "请输入BV/AV号")
        return;
      }
      let returnVideo = args.get(1);
      if(returnVideo == null) returnVideo = false;

      try {
        let result = "";
        let mdList = [];

        let api = `https://api.bilibili.com/x/web-interface/view?aid=${biliVideoId}`;
        if(isNaN(Number(biliVideoId))) {
          api = `https://api.bilibili.com/x/web-interface/view?bvid=${biliVideoId}`;
        }

        let response = Networks.getJson(api);
        let data = response.data;
        let bvid = data["bvid"];
        let aid = data["aid"];
        let cid = data["cid"];
        let title = data["title"];
        let tname = data["tname"];
        let tname_v2 = data["tname_v2"];
        let pubdate = data["pubdate"];
        let desc_v2 = data["desc_v2"];
        let owner = data["owner"];
        let pic = data["pic"];
        let stat = data["stat"];

        mdList.push(`## ${title} (AV${aid})\n`);
        mdList.push(`![封面](${pic} "封面")\n\n`)
        mdList.push(`投稿人：${owner["name"]}\n\n`)
        mdList.push(`投稿分区：${tname}-${tname_v2}\n\n`);
        mdList.push(`投稿时间：${fTime(pubdate)}\n\n`);
        mdList.push(`简介：\n`);
        for (const obj of desc_v2) {
          let raw_text = obj["raw_text"];
          mdList.push(`> ${raw_text}\n`);
        }
        mdList.push(`| 播放量             | 弹幕数量               | 点赞              | 投币              | 收藏                  | 分享               |`);
        mdList.push(`|-----------------|--------------------|-----------------|-----------------|---------------------|------------------|`);
        mdList.push(`| ${stat["view"]} | ${stat["danmaku"]} | ${stat["like"]} | ${stat["coin"]} | ${stat["favorite"]} | ${stat["share"]} |`);
        let md: any = h.image(Messages.generateMarkdown(mdList), 'image/png')

        let api2 = `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`;
        let response2 = Networks.getJson(api2);
        let data2 = response2.data;
        let durl = data2["durl"];

        result += `封面链接：${pic}\n`;
        for (const item of durl) {
          let url = item["url"];
          result += `直链地址：${url}\n`
        }
        await session.sendQueued(h('quote', {id: session.messageId}) + md);
        if(returnVideo) await session.sendQueued(h('quote', {id: session.messageId}) + result);
      } catch (err) {
        Messages.sendMessageToReply(session, "解析错误");
      }
    });

  public static get(): CommandProvider {
    let instance = new this();
    return instance.root;
  }
}
function fTime(timestamp: number) {
  const date = new Date(timestamp*1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
