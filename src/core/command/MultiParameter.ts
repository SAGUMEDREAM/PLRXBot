import {h} from "koishi";
import {CommandProvider} from "./CommandProvider";

export class MultiParameter {
  private map: Map<string, any> = new Map();

  public constructor(provider: CommandProvider, args: (string | h)[]) {
    this.build(provider, args);
  }

  private build(provider: CommandProvider, args: (string | h)[]) {
    let builder = provider.getMultiParameterBuilder();
    builder.getList().forEach((parameter, index) => {
      const value = args[index] !== undefined ? args[index] : parameter.defaultValue;
      this.map.set(parameter.id, value);
    });
  }

  public get(key: string) {
    return this.map.get(key);
  }

  public getMap() {
    return this.map;
  }
}

export enum TypeOfParameter {
  REQUIRED,
  OPTIONAL
}

export class Parameter {
  readonly name: string;
  readonly id: string;
  readonly type: TypeOfParameter;
  readonly defaultValue: any

  public constructor(name: string, id: string, defaultValue: any, type: TypeOfParameter) {
    this.name = name || id;
    this.id = id;
    this.type = type;
    this.defaultValue = defaultValue;
  }

  public asString(): string {
    return (() => {
      if (this.type == TypeOfParameter.REQUIRED) return `(${this.name})`;
      if (this.type == TypeOfParameter.OPTIONAL) return `<${this.name}>`;
    })();
  }
}

export class MultiParameterBuilder {
  protected list: Parameter[] = [];

  protected constructor() {
  }

  public addRequired(name: string, id: string): MultiParameterBuilder {
    this.list.push(new Parameter(name, id, null, TypeOfParameter.REQUIRED))
    return this;
  }

  public addOptional(name: string, id: string, defaultValue: string = null): MultiParameterBuilder {
    this.list.push(new Parameter(name, id, defaultValue, TypeOfParameter.OPTIONAL))
    return this;
  }

  public getList(): Parameter[] {
    return this.list;
  }

  public static getBuilder(): MultiParameterBuilder {
    return new MultiParameterBuilder();
  }
}
