import {h} from "koishi";
import {CommandProvider} from "./CommandProvider";

export class MultiParameter {
  private map: Map<string, any> = new Map<string, any>();
  private types: Map<string, DataTypes> = new Map<string, DataTypes>();

  public constructor(provider: CommandProvider, args: (string | h)[]) {
    this.build(provider, args);
  }

  private build(provider: CommandProvider, args: (string | h)[]) {
    let builder = provider.getMultiParameterBuilder();
    builder.getList().forEach((parameter, index) => {
      const value = args[index] !== undefined ? args[index] : parameter.defaultValue;
      this.map.set(parameter.id, value);
      this.types.set(parameter.id, parameter.data_type);
    });
  }

  public get(key: string) {
    return this.map.get(key);
  }

  public getType(key: string) {
    return this.types.get(key);
  }

  public getMap() {
    return this.map;
  }
}

export enum TypeOfParameter {
  REQUIRED,
  OPTIONAL
}

export enum DataTypes {
  ANY = "any",
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  INTEGER = "integer",
  FLOAT = "float",
  DOUBLE = "float",
  NEVER = "never",
  NULL = "never",
  UNDEFINED = "never"
}

export class Parameter {
  readonly name: string;
  readonly id: string;
  readonly type: TypeOfParameter;
  readonly defaultValue: any;
  readonly data_type: DataTypes;

  public constructor(name: string, id: string, defaultValue: any, type: TypeOfParameter, data_type: DataTypes = DataTypes.ANY) {
    this.name = name || id;
    this.id = id;
    this.type = type;
    this.defaultValue = defaultValue;
    this.data_type = data_type;
  }

  public asString(): string {
    return (() => {
      if (this.type == TypeOfParameter.REQUIRED) return `(${this.name}:${this.data_type})`;
      if (this.type == TypeOfParameter.OPTIONAL) return `<${this.name}:${this.data_type}>`;
    })();
  }
}

export class MultiParameterBuilder {
  protected list: Parameter[] = [];

  protected constructor() {
  }

  public addRequired(name: string, id: string, data_type: DataTypes = DataTypes.ANY): MultiParameterBuilder {
    this.list.push(new Parameter(name, id, null, TypeOfParameter.REQUIRED, data_type))
    return this;
  }

  public addOptional(name: string, id: string, defaultValue: string = null, data_type: DataTypes = DataTypes.ANY): MultiParameterBuilder {
    this.list.push(new Parameter(name, id, defaultValue, TypeOfParameter.OPTIONAL, data_type))
    return this;
  }

  public getList(): Parameter[] {
    return this.list;
  }

  public static getBuilder(): MultiParameterBuilder {
    return new MultiParameterBuilder();
  }
}
