export class AssertTools {
  public static is(val: any): boolean {
    return val == true;
  }
  public static not(val: any): boolean {
    return val == false;
  }
}

export const is = AssertTools.is
export const not = AssertTools.not
