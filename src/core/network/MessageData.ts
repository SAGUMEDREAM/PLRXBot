export class MessageData {
  public bot_id: number;
  public timestamp: number;
  public user: {
    user_avatar: string;
    user_id: number | string;
    username: string;
    nickname: string;
  };
  public message: {
    message_id: number;
    message_type: string | null;
    message_group: string | number | null;
    text: string;
  };

  constructor(data: {
    bot_id: number;
    timestamp: number;
    user: {
      user_avatar: string;
      user_id: number | string;
      username: string;
      nickname: string;
    };
    message: {
      message_id: number;
      message_type: string | null;
      message_group: string | number | null;
      text: string;
    };
  }) {
    this.bot_id = data.bot_id;
    this.timestamp = data.timestamp;
    this.user = data.user;
    this.message = data.message;
  }
  public toString(): string {
    return `Message Data:
    Bot ID: ${this.bot_id}
    Timestamp: ${this.timestamp}
    User: {
      Avatar: ${this.user.user_avatar}
      ID: ${this.user.user_id}
      Username: ${this.user.username}
      Nickname: ${this.user.nickname}
    }
    Message: {
      ID: ${this.message.message_id}
      Type: ${this.message.message_type}
      Group: ${this.message.message_group}
      Text: ${this.message.text}
    }`;
  }
}
