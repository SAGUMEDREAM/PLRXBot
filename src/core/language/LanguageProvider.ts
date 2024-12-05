export class LanguageProvider {
  private registry_key: string;
  private values: Map<string, string> = new Map<string, string>();

  public constructor(registry_key: string) {
    this.registry_key = registry_key;
  }

  public add(key: string, value: string) {
    this.values.set(key, value);
  }

  public of(registry_key: string, ...args: any[]): string {
    let RawText = this.values.get(registry_key);

    if (RawText == null) {
      return registry_key;
    }

    for (let arg of args) {
      RawText = RawText.replace('{}', arg);
    }

    return RawText;
  }

  public getRegistryKey() {
    return this.registry_key;
  }
}
