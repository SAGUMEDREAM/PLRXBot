import {h} from "koishi";
import {DataTypes, MultiParameter} from "./MultiParameter";
import {CommandProvider} from "./CommandProvider";

export class CommandArgs {
  protected raw: string;
  public args: (string | h)[];
  public header: string;
  public stats = {
    notUsed: [] as { index: number, accessed: boolean }[],
  };
  protected multiParameter: MultiParameter;

  public constructor(provider: CommandProvider, raw: string, args: (string | h)[]) {
    this.raw = raw;
    this.header = raw.split(' ')[0] || this.raw;
    this.args = args.flatMap((arg: any) => (typeof arg === 'string' ? arg.split(/\s+/) : arg));
    this.args.forEach((arg, index) => {
      this[index] = arg;
      this.stats.notUsed.push({index, accessed: false});
    });
    this.multiParameter = new MultiParameter(provider, this.args);
    this.multiParameter.getMap().forEach((value, key) => this[key] = value);
  }

  public getMultiParameter(): MultiParameter {
    return this.multiParameter;
  }

  public getParameter(key: string): any {
    return this.getMultiParameter().getMap().get(key);
  }

  public get(key: string): any {
    const value = this.getParameter(key);
    const index = this.args.findIndex(arg => arg === value);
    if (index !== -1) {
      const entry = this.stats.notUsed[index];
      if (entry && !entry.accessed) {
        entry.accessed = true;
      }
    }

    if (value == "true") return true;
    if (value == "false") return false;
    return value;
  }

  public getValue(key: string): any {
    let value = this.getParameter(key);
    let type: DataTypes = this.getMultiParameter().getType(key);

    const ValueToType = (type: DataTypes): any => {
      switch (type) {
        case DataTypes.ANY:
          return value;
        case DataTypes.STRING:
          return String(value);
        case DataTypes.NUMBER:
          return Number(value);
        case DataTypes.INTEGER:
          return parseInt(String(Number(value)), 10);
        case DataTypes.FLOAT:
          return parseFloat(String(Number(value)));
        case DataTypes.BOOLEAN:
          if (typeof value === "boolean") return value;
          if (value === "true") return true;
          if (value === "false") return false;
          return null;
        case DataTypes.NEVER:
          return null;
        default:
          return value;
      }
    };

    return ValueToType(type);
  }


  public at(index: number): any {
    const value = this.args[index];
    const entry = this.stats.notUsed[index];

    if (entry && !entry.accessed) {
      entry.accessed = true;
    }

    return value;
  }

  public getUserId(key: string): string | any {
    const arg: string | h = this.get(key);

    if (arg != null) {
      if (arg["type"] == 'at') {
        return arg["attrs"].id;
      }
    }

    if (typeof arg === 'string') {
      const match = arg.match(/id=(\d+)/);
      return match ? match[1] : arg;
    }

    return null;
  }

  public getRaw(): string {
    return this.raw;
  }

  public getArgumentsString(): string {
    return this.args.join(' ').trim();
  }

  public getNumber(key: string): number {
    const value = this.get(key);
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }
    return null;
  }

  public getBoolean(key: string): boolean {
    const value = this.get(key);
    if (value == "true") return true;
    if (value == "false") return false;
    return Boolean(value);
  }

  public getString(key: string): string {
    return String(this.get(key) || '');
  }

  public getRemaining(): string {
    return this.args.join(' ');
  }

  public includes(value: any): boolean {
    return (() => {
      if (this.args.includes(value)) return true;
      for (const mapValue of this.multiParameter.getMap().values()) {
        if (value == mapValue) {
          return true;
        }
      }
      return false;
    })();
  }

  public merge(): string {
    return this.args.join('');
  }

  public mergeWithSpace(): string {
    return this.args.join(' ').trim();
  }

  public mergeWithBreak(): string {
    return this.args.join('\n').trim();
  }

  public all(): any[] {
    return this.args;
  }

  public size(): number {
    return this.args.length;
  }

  public length(): number {
    return this.args.length;
  }

  public has(key: string): boolean {
    return this.multiParameter.getMap().has(key);
  }

  public hasIndex(index: number): boolean {
    return index >= 0 && index < this.args.length;
  }
}
