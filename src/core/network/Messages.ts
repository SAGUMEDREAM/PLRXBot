import {Context, Dict, Element, h, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../user/UserManager";
import {MessageData} from "./MessageData";
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from "node:fs";
import axios from "axios";
import {MIMEUtils} from "../utils/MIMEUtils";

const MARKDOWN_CACHE = new Map<string, { values: Element, timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_SIZE = 80;

export class Messages {
  public static getNextMessage(
    session: Session<User.Field, Channel.Field, Context>
  ): any {
    const message = UserManager.get(session).getProfileData()["next_message"]["message"];
    UserManager.get(session).getProfileData()["next_message"]["message"] = null;
    return message;
  }

  public static async getSenderPost(action: () => (any | void | Promise<any> | Promise<void>) = () => null): Promise<void> {
    let handler = {
      times: 0,
      action: () => null
    }
    handler.action = action;
    await handler.action()
    // for (; handler.times <= 2; ++handler.times) {
    //   try {
    //     await handler.action();
    //     break;
    //   } catch (err) {
    //   }
    // }
  }

  public static sendMessage(
    session: Session<User.Field, Channel.Field, Context>,
    message: any): void {
    this.getSenderPost(() => session.sendQueued(message));
  }

  public static sendMessageToGroup(
    session: Session<User.Field, Channel.Field, Context>,
    group_id: number,
    message: any) {
    this.getSenderPost(() => session.bot?.sendMessage(String(group_id), message));
  }

  public static sendMessageToReply(
    session: Session<User.Field, Channel.Field, Context>,
    message: any) {
    const message_id = session.messageId;
    this.getSenderPost(() => session.sendQueued(h('quote', {id: message_id}) + message));
  }

  public static deleteMessage(
    session: Session<User.Field, Channel.Field, Context>,
    message_id: string,
    channel_id: string
  ) {
    let channelId = session.event.message.quote.channel.id;
    let repId = session.event.message.quote.id;
    this.getSenderPost(() => session.bot.deleteMessage(channelId, repId));
  }

  public static sendPrivateMessage(
    session: Session<User.Field, Channel.Field, Context>,
    user_id: number,
    message: any) {
    this.getSenderPost(() => session.bot?.sendMessage(String(user_id), message));
  }

  public static async getMarkdown(data: any[]): Promise<Element> {
    const cacheKey = data.join("###");

    if (MARKDOWN_CACHE.has(cacheKey)) {
      return MARKDOWN_CACHE.get(cacheKey)!.values;
    }

    const api = "http://127.0.0.1:8099/markdown";
    const fm: FormData = new FormData();

    for (const item of data) {
      fm.append("texts", item);
    }

    const headers = {
      ...fm.getHeaders(),
      "Content-Type": "multipart/form-data",
    };

    try {
      const request = await axios.post(api, fm, {
        headers: headers,
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(request.data);
      const type = MIMEUtils.getType(buffer);
      const values = h.image(buffer, type);
      MARKDOWN_CACHE.set(cacheKey, { values, timestamp: Date.now() });

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
    url: string
  ): Promise<void> {
    fs.promises.readFile(url).then(buffer => {
      this.getSenderPost(() => Messages.sendMessage(session, h.audio(buffer, 'audio/mpeg')));
    }).catch(err => {
    });

  }

  public static async sendFile(
    session: Session<User.Field, Channel.Field, Context>,
    url: string
  ): Promise<void> {
    fs.promises.readFile(url).then(buffer => {
      this.getSenderPost(() => Messages.sendMessage(session, h.file(buffer, 'application/octet-stream')));
    }).catch(err => {
      console.error(err)
    });
  }

  public static async sendVideo(
    session: Session<User.Field, Channel.Field, Context>,
    url: string
  ): Promise<void> {
    fs.promises.readFile(url).then(buffer => {
      this.getSenderPost(() => Messages.sendMessage(session, h.video(buffer, 'video/mp4')));
    }).catch(err => {
    });
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

  public static at(user_id: number): {
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

  public static isAtBot(session: Session<User.Field, Channel.Field, Context>): boolean {
    return session.content.includes(`<at id=\"${session.bot.selfId}\"`);
  }

  public static parse(session: Session<User.Field, Channel.Field, Context>): MessageData {
    let event = session.event;
    let user = event.user;
    let message = event.message;

    let obj = {
      bot_id: Number(event.selfId),
      timestamp: event.timestamp,
      user: {
        user_avatar: user.avatar,
        user_id: Number(user.id),
        username: user.name,
        nickname: event.member?.nick || null,
      },
      message: {
        message_id: Number(message.id),
        message_type: null,
        message_group: event.guild?.id || null,
        text: message.content,
      },
    };

    return new MessageData(obj);
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
