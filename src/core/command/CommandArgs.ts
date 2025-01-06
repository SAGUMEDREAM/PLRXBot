import { Utils } from "../utils/Utils";

export class CommandArgs {
  public raw: string;
  public args: any[];

  constructor(raw: string, args: any[]) {
    this.raw = raw;
    this.args = this.mergeHtmlTags(args);
    //console.log(this.args)
    this.args.forEach((arg, index) => this[index] = arg);
  }

  private mergeHtmlTags(args: any[]): any[] {
    const mergedArgs: any[] = [];
    let currentArg = '';

    for (const arg of args) {
      if (currentArg.length === 0 && arg.startsWith('<')) {
        currentArg = arg;
      } else if (currentArg.length > 0) {
        currentArg += ` ${arg}`;
        if (arg.endsWith('/>') || arg.endsWith('>')) {
          mergedArgs.push(currentArg);
          currentArg = '';
        }
      } else {
        mergedArgs.push(arg);
      }
    }

    if (currentArg.length > 0) {
      mergedArgs.push(currentArg);
    }

    mergedArgs.forEach((value, index, array) => {
      mergedArgs[index] = Utils.fixHtmlTag(value);
    });

    return mergedArgs;
  }

  public includes(value: any): boolean {
    return this.args.includes(value)
  }
  public merge(): any {
    return this.args.join('');
  }
  public mergeWithSpace(): any {
    let result = ``;
    this.args.forEach(arg => {
      result += `${arg} `;
    });
    result = result.trim();
    return result;
  }

  public mergeWithBreak(): any {
    let result = ``;
    this.args.forEach(arg => {
      result += `${arg}\n`;
    });
    result = result.trim();
    return result;
  }

  public get(index: number): any {
    return this.args[index];
  }

  public getUserId(index: number): any {
    const match = this.args[index].match(/id=(\d+)/);
    return (match ? match[1] : null) || this.get(index);
  }

  public getRaw(): string {
    return this.raw;
  }

  public getNumber(index: number): number {
    try {
      return Number(this.args[index]);
    } catch (error) {
      return -1;
    }
  }
  public getBoolean(index: number): boolean {
    try {
      return Boolean(this.args[index]);
    } catch (error) {
      return false;
    }
  }

  public getString(index: number): string {
    try {
      return this.args[index];
    } catch (error) {
      return '';
    }
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

  public has(index: number): boolean {
    return index >= 0 && index < this.args.length;
  }
}
