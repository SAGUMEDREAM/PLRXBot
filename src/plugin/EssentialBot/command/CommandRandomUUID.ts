import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export class CommandRandomUUID {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {
      const uuid = generateUUID();
      await Messages.sendMessageToReply(session, "UUID: " + uuid);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
