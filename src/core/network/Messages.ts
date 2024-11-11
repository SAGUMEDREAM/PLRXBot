import {Context, Dict, Element, h, Session} from "koishi";
import {Channel, User} from "@koishijs/core";
import {UserManager} from "../user/UserManager";
import {MessageData} from "../network/MessageData";

export class Messages {
  public static getNextMessage(
    session: Session<User.Field, Channel.Field, Context>
  ): any {
    const message = UserManager.get(session).getProfileData()["next_message"]["message"];
    UserManager.get(session).getProfileData()["next_message"]["message"] = null;
    return message;
  }

  public static sendMessage(
    session: Session<User.Field, Channel.Field, Context>,
    message: any): void {
    session.sendQueued(message);
  }

  public static sendMessageToGroup(
    session: Session<User.Field, Channel.Field, Context>,
    group_id: number,
    message: any) {
    session.bot?.sendMessage(String(group_id), message);
  }

  public static sendMessageToReply(
    session: Session<User.Field, Channel.Field, Context>,
    message: any) {
    const message_id = session.messageId;
    session.sendQueued(h('quote', {id: message_id}) + message);
  }

  public static sendPrivateMessage(
    session: Session<User.Field, Channel.Field, Context>,
    user_id: number,
    message: any) {
    session.bot?.sendMessage(String(user_id), message);
  }

  public static image(
    src: string): {
    type: string | Element.Render<Element.Fragment, any>,
    attrs: Dict,
    children: Element[],
  } {
    return h('img', {src: `${src}`});
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
}
