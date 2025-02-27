export enum Code {
  OK = 200,
  UNDEFINED = 0,
  ERROR = 400
}

export class Result {
  public code: number;
  public message: string;
  public data: any;

  constructor(code: Code | number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export class Results {
  public static success(data: any = null, message: string = "ok"): Result {
    return new Result(Code.OK, message, data);
  }

  public static error(data: any = null, message: string = "error"): Result {
    return new Result(Code.OK, message, data);
  }

  public static custom(code: number = Code.UNDEFINED, data: any = null, message: string = "undefined"): Result {
    return new Result(code, message, data);
  }
}
