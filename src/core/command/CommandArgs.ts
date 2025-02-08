import {h} from "koishi";
import {MultiParameter} from "./MultiParameter";
import {CommandProvider} from "./CommandProvider";

export class CommandArgs {
  public raw: string;
  public args: (string | h)[];
  protected multiParameter: MultiParameter;

  public constructor(provider: CommandProvider, raw: string, args: (string | h)[]) {
    this.raw = raw;
    this.args = args.flatMap((arg: any) => (typeof arg === 'string' ? arg.split(/\s+/) : arg));
    this.args.forEach((arg, index) => (this[index] = arg));
    this.multiParameter = new MultiParameter(provider, this.args);
  }

  public getMultiParameter(): MultiParameter {
    return this.multiParameter;
  }

  public getParameter(key: string): any {
    return this.multiParameter.getMap().get(key);
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

  public get(key: string): any {
    return this.getMultiParameter().get(key);
  }

  public at(index: number): any {
    return this.args[index];
  }

  public getUserId(key: string): any {
    const arg: string | h = this.get(key);

    if (arg["type"] === 'at') {
      return arg["attrs"].id;
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
    const value = this.args[key];
    return Boolean(value);
  }

  public getString(key: string): string {
    return String(this.args[key] || '');
  }

  public getRemaining(): string {
    return this.args.join(' ');
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
