import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";
import {Utils} from "../../../core/utils/Utils";

export class CommandLeaveMessage {
  public root = new CommandProvider()
    .onExecute((session, args) => {
      let text = `💬💬💬`;
      text += `\n`;
      text += `${Messages.at(807131829)}`;
      text += `\n\n`;
      text += `账号:${session.event.user.name}(${session.event.user.id})\n`;
      text += `留言:\n`
      {
        const messageSource = Utils.sliceArrayFrom(args.all(),0);
        const messages = [];
        messageSource.forEach((message) => {
          if(Utils.isHtmlTag(message)) {
            if(Utils.isImgTag(message)) {
              const src = Utils.getImgSrc(message);
              if(src) {
                messages.push(Messages.image(src));
              }
            } else {
              messages.push(message);
            }
          } else {
            messages.push(message);
          }
          //console.log(Utils.getHtmlTagObject(messages))
        });
        text += messages.join('');
      }
      Messages.sendMessageToReply(session,"留言发送成功!")
      Messages.sendMessageToGroup(session,863842932, text);
    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
