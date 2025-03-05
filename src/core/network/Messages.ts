import {Context, Dict, Element, h, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../user/UserManager";
import {MessageData} from "./MessageData";
import FormData from 'form-data';
import fs from "node:fs";
import axios from "axios";
import {MIMEUtils} from "../utils/MIMEUtils";
import {KoishiImages} from "./KoishiImages";
import {LOGGER} from "../../index";
import {Constant} from "../Constant";
import {randomUUID} from "node:crypto";
import path from "path";
import {pathToFileURL} from "node:url";
import tlds from "tlds";
import {PlatformUtils} from "../utils/PlatformUtils";
import {Filters} from "../utils/Filters";

const mime = require('mime-types');
const MARKDOWN_CACHE = new Map<string, { values: Element, timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_SIZE = 80;
const TWENTY_MINUTES_IN_MS = 20 * 60 * 1000;

export class Messages {
  public static async getNextMessage(
    session: Session<User.Field, Channel.Field, Context>
  ): Promise<any> {
    const user = await UserManager.get(session);
    const message = user.getProfileData()["next_message"]["message"];
    user.getProfileData()["next_message"]["message"] = null;
    return message;
  }

  public static async getSendPoster(action: () => (any | void | Promise<any> | Promise<void>) = async () => null): Promise<any> {
    let handler = {
      action: async () => null
    }
    handler.action = action;
    const run = await handler.action();
    if (Constant.TEMP_FILE_CONFIG != null) {
      Messages.deleteTempFiles();
    }
    return run;
  }

  public static async createTempFile(buffer: Buffer): Promise<string | null> {
    const tempFilePath: string = Constant.TEMP_FILE_PATH;
    const filename: string = randomUUID().toString();

    const mimeType = mime.lookup(buffer);
    if (!mimeType) {
      return null;
    }

    const fileExtension: string = mime.extension(mimeType);
    const filePath: string = path.resolve(tempFilePath, `${filename}.${fileExtension}`);

    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  public static deleteTempFiles(): void {
    const currentTime: number = Date.now();
    const fileConfig = Constant.TEMP_FILE_CONFIG.getConfig();

    const deleteFile = (filePath: string) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        LOGGER.error(`Failed to delete file: ${filePath}`, err);
      }
    }

    fileConfig.files = fileConfig.files.filter(file => {
      const fileAge = currentTime - file.timestamp;
      if (fileAge > TWENTY_MINUTES_IN_MS) {
        deleteFile(file.path);
        return false;
      }
      return true;
    });

    Constant.TEMP_FILE_CONFIG.save();
  }

  public static async filterMessages(
    session: Session<User.Field, Channel.Field, Context>,
    content: any
  ): Promise<string> {
    const isQQ: boolean = session.platform === "qq" || session.platform === "qqguild";
    if(!Filters.isLegal(content)) {
      content = String(Filters.replace(content));
    }
    if (!isQQ) return content;
    if (isQQ) {
      const elements: Element[] = h.parse(String(content));
      const images: Element[] = [];
      const others: Element[] = [];
      const mode: string = "unicode"
      let replacer = "";
      if (mode == "unicode") replacer = "‎.";    // 点号前插入unicode字符（不可见所以无痕，但复制访问不方便）
      if (mode == 'space') replacer = " .";        // 点号前插入空格（复制访问相对来说方便些）
      if (mode == 'fullStop') replacer = "。";     // 点号替换为中文句号（可直接复制访问）
      const tlds_en = tlds.filter(d => d.charAt(0) >= 'a' && d.charAt(0) <= 'z')
      const domainRegExp = new RegExp(
        `([A-Za-z0-9]+\\.)+(${tlds_en.join("|")})(?=[^A-Za-z0-9]|$)`,
        "g",
      )
      const whiteList = [];
      const sanitizeDomains = (elements: Element[]) => {
        for (const {attrs, type, children} of elements) {
          if (type !== "text") {
            if (children.length) sanitizeDomains(children);
            continue;
          }
          attrs.content = (attrs.content as string).replaceAll(
            domainRegExp,
            (domain: string) => {
              if (whiteList.includes(domain)) return domain;
              return domain.replaceAll(".", replacer);
            },
          );
        }
      }
      sanitizeDomains(elements);
      for (const element of elements) {
        if (element.type === "at") {
          continue;
        }

        if (element.type === "image" || element.type === "img") {
          images.push(element);
          // const src: string = element.attrs.src;
          // if (src.startsWith("data:image")) {
          //   const base64Data: string = src.split(',')[1];
          //   const buffer: Buffer = Buffer.from(base64Data, 'base64');
          //   const tempFilePath: string = await this.createTempFile(buffer);
          //
          //   if (tempFilePath) {
          //     const imagePath: string = pathToFileURL(path.join(tempFilePath)).href;
          //     images.push(h.image(imagePath));
          //   }
          // } else {
          //   images.push(element);
          // }
        } else {
          others.push(element);
        }
      }

      content = [...images, ...others];
      return String(content);
    }

    return content;
  }


  public static async sendMessage(
    session: Session<User.Field, Channel.Field, Context>,
    message: any): Promise<any> {
    message = await this.filterMessages(session, message);
    return await this.getSendPoster(async () => await session.sendQueued(message));
  }

  public static async sendMessageToGroup(
    session: Session<User.Field, Channel.Field, Context>,
    group_id: number,
    message: any): Promise<any> {
    message = await this.filterMessages(session, message);
    return await this.getSendPoster(async () => await session.bot?.sendMessage(String(group_id), message));
  }

  public static async sendMessageToReply(
    session: Session<User.Field, Channel.Field, Context>,
    message: any): Promise<any> {
    const message_id = session.messageId;
    const isInQQ = session.platform == "qq" || session.platform == "qqguild";
    message = await this.filterMessages(session, message);
    if (isInQQ) {
      return await this.getSendPoster(async () => await session.sendQueued(message));
    } else {
      return await this.getSendPoster(async () => await session.sendQueued(h('quote', {id: message_id}) + message));
    }
  }

  public static async deleteMessage(
    session: Session<User.Field, Channel.Field, Context>,
    message_id: string,
    channel_id: string
  ): Promise<any> {
    const channelId = session.event.message.quote.channel.id;
    const repId = session.event.message.quote.id;
    return await this.getSendPoster(async () => await session.bot.deleteMessage(channelId, repId));
  }

  public static async sendPrivateMessage(
    session: Session<User.Field, Channel.Field, Context>,
    user_id: number,
    message: any) {
    message = await this.filterMessages(session, message);
    return await this.getSendPoster(async () => await session.bot?.sendMessage(String(user_id), message));
  }

  public static async markdown(data: any[]): Promise<Element> {
    const cacheKey: string = data.join("###");

    if (MARKDOWN_CACHE.has(cacheKey)) {
      return MARKDOWN_CACHE.get(cacheKey)!.values;
    }

    const api: string = "http://127.0.0.1:8099/markdown";
    const fm: FormData = new FormData();

    for (const item of data) {
      fm.append("texts", item);
    }

    const headers = {
      ...fm.getHeaders(),
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await axios.post(api, fm, {
        headers: headers,
        responseType: "arraybuffer",
      });

      const buffer: Buffer = Buffer.from(response.data);
      const type: string = MIMEUtils.getType(buffer);
      const values: Element = h.image(buffer, type);
      MARKDOWN_CACHE.set(cacheKey, {values, timestamp: Date.now()});

      if (MARKDOWN_CACHE.size > CACHE_SIZE) {
        const firstKey = MARKDOWN_CACHE.keys().next().value;
        MARKDOWN_CACHE.delete(firstKey);
      }

      return values;
    } catch (error) {
      throw error;
    }
  }

  public static async sendAudio(
    session: Session<User.Field, Channel.Field, Context>,
    path: string
  ): Promise<void> {
    const buffer: Buffer = await fs.promises.readFile(path);
    return await this.getSendPoster(async () => await Messages.sendMessage(session, h.audio(buffer, 'audio/mpeg')));
  }

  public static async sendAudioBuffer(
    session: Session<User.Field, Channel.Field, Context>,
    buffer: Buffer
  ): Promise<void> {
    let mimeType: string = MIMEUtils.getType(buffer);
    if (mimeType == "application/octet-stream") mimeType = 'audio/mpeg';
    return await this.getSendPoster(async () => await Messages.sendMessage(session, h.audio(buffer, mimeType)));
  }

  public static async sendFile(
    session: Session<User.Field, Channel.Field, Context>,
    path: string
  ): Promise<void> {
    const buffer: Buffer = await fs.promises.readFile(path);
    return await this.getSendPoster(async () => await Messages.sendMessage(session, h.file(buffer, 'application/octet-stream')));
  }

  public static async sendVideo(
    session: Session<User.Field, Channel.Field, Context>,
    url: string
  ): Promise<void> {
    const buffer = await fs.promises.readFile(url);
    return await this.getSendPoster(async () => await Messages.sendMessage(session, h.video(buffer, 'video/mp4')));
  }

  public static h(obj: any) {
    return h(obj);
  }

  public static image(
    src: string): {
    type: string | Element.Render<Element.Fragment, any>,
    attrs: Dict,
    children: Element[],
  } {
    return h('img', {src: `${src}`});
  }

  public static imageBuffer(
    buffer: Buffer): {
    type: string | Element.Render<Element.Fragment, any>,
    attrs: Dict,
    children: Element[],
  } {
    return h.image(buffer, MIMEUtils.getType(buffer));
  }

  public static at(user_id: number | string): {
    type: string | Element.Render<Element.Fragment, any>,
    attrs: Dict,
    children: Element[],
  } {
    return h('at', {id: `${user_id}`});
  }

  public static quote(message_id: number): {
    type: string | Element.Render<Element.Fragment, any>,
    attrs: Dict,
    children: Element[],
  } {
    return h('quote', {id: message_id});
  }

  public static async getImageList(session: Session<User.Field, Channel.Field, Context>): Promise<KoishiImages[]> {
    const elements = session.elements;
    const imgs = elements.filter(element => element.type === 'img');

    return await Promise.all(imgs.map(async (img) => {
      const koishiImg = new KoishiImages();
      koishiImg.file = img.attrs.file;
      koishiImg.src = img.attrs.src;

      try {
        const response = await axios.get(koishiImg.src, {responseType: 'arraybuffer'});
        koishiImg.buffer = Buffer.from(response.data);
        koishiImg.mime_type = MIMEUtils.getType(koishiImg.buffer);
      } catch (error) {
        LOGGER.error(`图片下载失败: ${koishiImg.src}`);
        LOGGER.error(error);
      }

      return koishiImg;
    }));
  }

  public static isAtBot(session: Session<User.Field, Channel.Field, Context>): boolean {
    return session.content.includes(`<at id=\"${session.bot.selfId}\"`);
  }

  public static parse(session: Session<User.Field, Channel.Field, Context>): MessageData {
    const event = session.event;
    const user = event.user;
    const obj = {
      bot_id: Number(session.selfId),
      timestamp: session.timestamp,
      user: {
        user_avatar: user.avatar,
        user_id: isNaN(Number(session.userId)) ? session.userId : Number(session.userId),
        username: session.username,
        nickname: event.member?.nick || null,
      },
      message: {
        message_id: Number(session.messageId),
        message_type: null,
        message_group: session.guildId || null,
        text: session.content,
      },
    };

    return new MessageData(obj);
  }

  public static async getBuffer(url: string): Promise<Buffer | null> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      LOGGER.error(error);
      return null;
    }
  }

  public static async postBuffer(url: string, option?: object): Promise<Buffer | null> {
    try {
      const response = await axios.post(url, option, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      LOGGER.error(error);
      return null;
    }
  }

  public static getUserAvatarImage(user_id: string | number) {
    return this.image(this.getUserAvatarImageUrl(user_id));
  }

  public static getUserAvatarImageUrl(user_id: string | number): string {
    return `https://q.qlogo.cn/headimg_dl?dst_uin=${user_id}&spec=640&img_type=jpg`
  }

  public static getGroupAvatarImage(group_id: string | number) {
    return this.image(this.getGroupAvatarImageUrl(group_id));
  }

  public static getGroupAvatarImageUrl(group_id: string | number): string {
    return `https://p.qlogo.cn/gh/${group_id}/${group_id}/640/`
  }

  public static async getNickname(user_id: string | number): Promise<string> {
    const api = `https://api.szfx.top/qq/info/?qq=${encodeURIComponent(user_id)}`;
    try {
      let response = await axios.get(api);
      const json = response.data;
      return json["nickname"];
    } catch (error) {
      return null;
    }
  }

}
