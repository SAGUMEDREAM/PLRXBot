import {CommandProvider} from "../../../core/command/CommandProvider";

export class CommandQueryActivity {
  public readonly root = new CommandProvider()
    .onExecute(async (session, args) => {

    })
  ;
  public static get(): CommandProvider {
    return new this().root;
  }
}
