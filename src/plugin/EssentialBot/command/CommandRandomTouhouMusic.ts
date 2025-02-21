import {CommandProvider} from "../../../core/command/CommandProvider";

export class CommandRandomTouhouMusic {
  public root = new CommandProvider()
    .onExecute(async (session, args) => {

    });
  public static get(): CommandProvider {
    return new this().root;
  }
}
