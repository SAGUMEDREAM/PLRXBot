import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";

export class CommandTestParameter {
  public readonly root = new CommandProvider()
    .addRequiredArgument('option1', 'option1')
    .addRequiredArgument('option2', 'option2')
    .onExecute((session, args) => {
      Messages.sendMessage(session,
        `option1: ${args.getParameter('option1')}\noption2: ${args.getParameter('option2')}\nraw: ${args.getRaw()}\nstring: ${args.getArgumentsString()}`
      )
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
