import {LanguageProvider} from "./LanguageProvider";
import {Files} from "../utils/Files";
import {Constant} from "../Constant";
import {LOGGER} from "../../index";
import {Reloadable} from "../impl/Reloadable";

export class LanguageTypes implements Reloadable {
  public static readonly Types: Map<string,LanguageProvider> = new Map<string,LanguageProvider>();
  public static Type: LanguageProvider;
  public static init() {
    LOGGER.info("Loading LanguageProviders...")
    const path: string = LanguageTypes.getLangPath();
    const files = Files.getDir(path);
    files.forEach((file: string) => {
      const filename = Files.getFileName(file);
      LOGGER.info(`Loading Language Config ${filename}.json`);
      const reader = Files.read(file);
      const provider = this.register(filename);
      const languageObject = JSON.parse(reader);
      for (const [key, value] of Object.entries(languageObject)) {
        provider.add(key,value.toString());
      }
    });
    this.Type = this.Types.get("zh_cn");
  }

  public async reload(): Promise<void> {
    LanguageTypes.Types.clear();
    LanguageTypes.Type = null;
  }

  public static register(registry_key: string): LanguageProvider {
    const provider = new LanguageProvider(registry_key);
    this.Types.set(registry_key, provider);
    return provider;
  }
  public static getLangPath() {
    return Constant.LANGUAGE_PATH;
  }
}
