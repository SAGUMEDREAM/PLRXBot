import {DataFixerMode} from "./DataFixerMode";
import {LOGGER} from "../../index";

export class DataFixer {
  private key: string;
  private defaultKey: any;
  private oldKey: string;
  private newKey: string;
  private dataFixerMode: DataFixerMode;
  private arg: any;
  private constructor(key: any, arg: any = null, dataFixerMode: DataFixerMode) {
    this.dataFixerMode = dataFixerMode;
    this.key = key;
    this.arg = arg;
    this.init();
  }
  private init() {
    if(this.dataFixerMode == DataFixerMode.Create) {
      this.defaultKey = this.arg;
    } else if(this.dataFixerMode == DataFixerMode.Remove) {
    } else if(this.dataFixerMode == DataFixerMode.Move) {
      this.oldKey = this.key;
      this.newKey = this.arg;
    }
  }

  public verify(data: any): any {
    switch (this.dataFixerMode) {
      case DataFixerMode.Create: {
        if (typeof this.defaultKey === 'object' && this.defaultKey !== null) {
          if (!(this.key in data)) {
            data[this.key] = Array.isArray(this.defaultKey) ? [] : {};
          }
          for (const [key, value] of Object.entries(this.defaultKey)) {
            if (!(key in data[this.key])) {
              data[this.key][key] = value;
            }
          }
        } else {
          // 非对象类型，直接赋值
          if (!(this.key in data)) {
            data[this.key] = this.defaultKey;
          }
        }
        break;
      }
      case DataFixerMode.Remove: {
        if (this.key in data) {
          delete data[this.key];
        }
        break;
      }
      case DataFixerMode.Move: {
        if (this.oldKey in data) {
          data[this.newKey] = data[this.oldKey];
          delete data[this.oldKey];
        }
        break;
      }
      default: {
        LOGGER.error(`Invalid DataFixerMode ${this.dataFixerMode}`)
      }
    }
    return data;
  }

  public static moveKey(oldKey: string, newKey: string): DataFixer {
    return new DataFixer(oldKey, newKey, DataFixerMode.Move);
  }

  public static removeKey(key: string): DataFixer {
    return new DataFixer(key, null, DataFixerMode.Remove);
  }

  public static createKey(key: string, defaultValue: any = null): DataFixer {
    return new DataFixer(key, defaultValue, DataFixerMode.Create);
  }
}
