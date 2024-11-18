import {DataFixer} from "./DataFixer";
import {Maths} from "../utils/Maths";

export class DataFixerBuilder {
  private dataFixerMap: Map<string, DataFixer> = new Map<string, DataFixer>();
  private type: string;
  private confirm: boolean = false;

  private constructor(type: string) {
    this.type = type;
  }

  public createDataKey(key: string, defaultValue: any = null): DataFixerBuilder {
    const dataFixer = DataFixer.createKey(key, defaultValue);
    const regKey  = `${key}${Maths.getSequence()}`
    this.dataFixerMap.set(regKey, dataFixer);
    return this;
  }

  public removeDataKey(key: string): DataFixerBuilder {
    const dataFixer = DataFixer.removeKey(key);
    const regKey  = `${key}${Maths.getSequence()}`
    this.dataFixerMap.set(regKey, dataFixer);
    return this;
  }
  public moveDataKey(key0: string, key1: string): DataFixerBuilder {
    const dataFixer = DataFixer.moveKey(key0, key1);
    const regKey  = `${key1}${Maths.getSequence()}`
    this.dataFixerMap.set(regKey, dataFixer);
    return this;
  }

  public all(): IterableIterator<[string, DataFixer]> {
    return this.dataFixerMap.entries();
  }

  public build(): DataFixerBuilder {
    this.confirm = true;
    return this;
  }

  public isConfirm(): boolean {
    return this.confirm;
  }

  public static createBuilder(type: string): DataFixerBuilder {
    return new DataFixerBuilder(type);
  }
}
