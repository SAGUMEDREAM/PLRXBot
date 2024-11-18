export class SheetEvent {
  public static getEvent(typeString: string) {
    let result = "THO";
    switch (typeString.toLowerCase()) {
      case "THO": {
        result = "THO";
        break;
      }
      case "THP": {
        result = "THP&tea-party";
        break;
      }
      case "PARTY": {
        result = "THP&tea-party";
        break;
      }
      case "TEA-PARTY": {
        result = "THP&tea-party";
        break;
      }
      case "school": {
        result = "School";
        break;
      }
      case "live": {
        result = "Live";
        break;
      }
    }
    return result;
  }
}
