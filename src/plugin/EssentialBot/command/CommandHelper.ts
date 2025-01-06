import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {MessageMerging} from "../../../core/network/MessageMerging";
import {h} from "koishi";

export class CommandCommandHelper {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      const mdList = [
        '## 蓬莱人形Bot\n',
        '蓬莱人形Bot是一个面向东方Project/音MAD/maimai/二次元QQ群的QQ机器人。\n',
        '\n',
        '所有命令无需@使用\n',
        '### 参数规则\n',
        '* `<>`：表示可选参数\n',
        '* `()`：表示必须参数\n',
        '* `|`：表示选项之间用竖线分隔，任选其一\n',
        '### Bot相关\n',
        '* `/help`：获取帮助菜单\n',
        '* `/usage (命令)`：获取命令的使用方法\n',
        '* `/留言 (内容)`：向开发者留言\n',
        '* `/关于`：获取Bot关于部分\n',
        '### 东方Project相关\n',
        '* `/活动搜索 (活动名称|地区名称|时间) <-H>`：搜索东方线下活动，-H允许查看历史活动信息\n',
        '* `/群组搜索 (群号|主办方|群名称)`：搜索各地区东方Project群聊\n',
        '* `/莉莉云 (关键词)`：搜索莉莉云资源\n',
        '* `/随机东方图`：获取一张随机东方图\n',
        '### 娱乐相关\n',
        '* `/jrrp`：获取今日运势\n',
        '* `/choice (数字) (...内容)`：选择困难帮助器\n',
        '* `/签到`：每日签到，累计获取货币\n',
        '* `/赞我`：每日点赞\n',
        '* `/查询库存`：查看用户拥有的物品\n',
        '* `/参拜神社`：使用一定量的货币参拜神社获得信仰值\n',
        '* `/查询信仰`：查询当前信仰值\n',
        '* `/说怪话 <文本>`：根据关键词或随机模仿群友说怪话\n',
        '### 生成相关\n',
        '* `/BA (文本) (文本)`：生成仿BALogo！\n',
        '* `/5k (文本) (文本)`：生成5000兆円欲しい！\n',
        '* `/活字印刷 (文本)`：根据Otto电棍印刷语句\n',
        '### 舞萌DX相关\n',
        '* `/b50`：根据落雪咖啡屋获取你的B50图\n',
        '* `/别名 (歌曲名称)`：获取歌曲信息\n',
        '* `/查歌 (歌曲名)`：查询歌曲信息\n',
        '* `/点歌 (歌曲名)`：点一首maimai歌\n',
        '* `/随机歌曲`：随机点一首MaiMai歌\n',
        '* `/搜歌 (关键词|分区|艺人们|歌曲ID)`：搜索歌曲\n',
        '### 音MAD相关\n',
        '* `/音MAD助手 (类型)`：快捷导航获取\n',
        '    * 类型：`艾拉软件库|音MAD维基|音MAD贴吧|音MAD教学|音MAD社团|人声分离|东方midi|midishow|lookae|免费日语字体`\n',
        '* `/修音`：发送命令后将文件上传即可获取修音后的文件\n',
        '* `/b站解析 (AV号|BV号) <true|false>`：解析B站视频\n',
        '    * true|false：`是否返回视频直链及封面链接`\n',
        '### 其他相关\n',
        '* `/mcs (主机地址) (端口号)`：获取Minecraft服务器的信息\n',
        '> 注：如果在使用过程中需要帮助或者是想提建议的可以加入开发群863842932\n'
      ];

      Messages.sendMessageToReply(session, h.image(Messages.generateMarkdown(mdList), 'image/png'));
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
