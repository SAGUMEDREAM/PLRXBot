import {CommandProvider} from "../../../core/command/CommandProvider";
import {h} from "koishi";
import {Messages} from "../../../core/network/Messages";
import {Networks} from "../../../core/network/Networks";

export class CommandBilibiliDownload {
  public root = new CommandProvider()
    .addRequiredArgument("BV号|AV号", "video_id")
    .addOptionalArgument("true|false", "download")
    .onExecute(async (session, args) => {
      let biliVideoId = args.get("video_id");
      let returnVideo = args.getBoolean("download");
      if(returnVideo == null) returnVideo = false;

      try {
        let result = "";
        let mdList = [];

        let api = `https://api.bilibili.com/x/web-interface/view?aid=${biliVideoId}`;
        if(isNaN(Number(biliVideoId))) {
          api = `https://api.bilibili.com/x/web-interface/view?bvid=${biliVideoId}`;
        }

        let response = await Networks.getJson(api);
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
        let md: any = await Messages.markdown(mdList);

        let api2 = `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`;
        let response2 = await Networks.getJson(api2);
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
        await Messages.sendMessageToReply(session, "解析错误");
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
