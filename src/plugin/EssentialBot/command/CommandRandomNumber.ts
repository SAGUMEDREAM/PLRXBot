import {CommandProvider} from "../../../core/command/CommandProvider";
import {Messages} from "../../../core/network/Messages";

const generateRandomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
export class CommandRandomNumber {
  public root = new CommandProvider()
    .addOptionalArgument("最大值", "max", 100)
    .addOptionalArgument("最小值", "min", 0)
    .onExecute(async (session, args) => {
      const number = generateRandomNumber(args.getNumber("min"), args.getNumber("max"));
      Messages.sendMessageToReply(session, number);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
