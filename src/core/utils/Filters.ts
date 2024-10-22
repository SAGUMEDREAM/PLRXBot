export class Filters {
  public static list: string[] = [];

  static isLegal(message: string): boolean {
    message = message.toLowerCase();

    for (const word of this.list) {
      const parts = word.split("");
      let lastIndex = -1;
      let match = true;

      for (const part of parts) {
        const index = message.indexOf(part, lastIndex + 1);
        if (index === -1 || index - lastIndex > 3) {
          match = false;
          break;
        }
        lastIndex = index;
      }

      if (match) {
        return false;
      }
    }

    return true;
  }
}
