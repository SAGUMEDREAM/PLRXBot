import {CommandProvider} from "../CommandProvider";
import {Messages} from "../../network/Messages";

export class CommandTestParameter {
  public readonly root = new CommandProvider()
    .addOptionalArgument('option1', 'option1', null)
    .addOptionalArgument('option2', 'option2', null)
    .addOptionalArgument('option3', 'option3', null)
    .addOptionalArgument('option4', 'option4', null)
    .addOptionalArgument('option5', 'option5', null)
    .addOptionalArgument('option6', 'option6', null)
    .addOptionalArgument('option7', 'option7', null)
    .addOptionalArgument('option8', 'option8', null)
    .onExecute(async (session, args) => {
      let message = '';
      message += `option1: ${args.getParameter('option1')} type: ${typeof args.getParameter('option1')}\n`;
      message += `option2: ${args.getParameter('option2')} type: ${typeof args.getParameter('option2')}\n`;
      message += `option3: ${args.getParameter('option3')} type: ${typeof args.getParameter('option3')}\n`;
      message += `option4: ${args.getParameter('option4')} type: ${typeof args.getParameter('option4')}\n`;
      message += `option5: ${args.getParameter('option5')} type: ${typeof args.getParameter('option5')}\n`;
      message += `option6: ${args.getParameter('option6')} type: ${typeof args.getParameter('option6')}\n`;
      message += `option7: ${args.getParameter('option7')} type: ${typeof args.getParameter('option7')}\n`;
      message += `option8: ${args.getParameter('option8')} type: ${typeof args.getParameter('option8')}\n`;
      message += `raw: ${args.getRaw()}\nstring: ${args.getArgumentsString()}`

      await Messages.sendMessage(session, message);
    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
