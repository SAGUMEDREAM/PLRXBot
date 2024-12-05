import {CommandProvider} from "../../../core/command/CommandProvider";

export class CommandB50 {
  private api = "https://www.diving-fish.com/api/maimaidxprober/query/player";
  private root = new CommandProvider()
    .onExecute((session, args) => {

    });

  public static get(): CommandProvider {
    return new this().root;
  }
}
