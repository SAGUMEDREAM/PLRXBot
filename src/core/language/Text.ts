import {LanguageTypes} from "./LanguageTypes";

export class Text {
  public static of(registry_key: string, ...args: any[]): string {
    if(LanguageTypes.Type != null) {
      LanguageTypes.Type.of(registry_key, args);
    } else {
      return registry_key;
    }
  }
}
