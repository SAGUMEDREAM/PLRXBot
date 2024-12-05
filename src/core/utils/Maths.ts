export class Maths {
  public static random(a: number, b: number): number {
    if (a > b) {
      [a, b] = [b, a];
    }
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }
  public static getRandomElement<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  public static getSequence(): string {
    return `@${Maths.getRandomSequence(6)}`;
  }
  public static getRandomSequence(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 字母和数字
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
}
