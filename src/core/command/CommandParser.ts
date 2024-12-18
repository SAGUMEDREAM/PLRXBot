export class CommandParser {
  public input: string;

  constructor(input: string) {
    this.input = input;
  }

  public parse(): { command: string, args: string[] } {
    const parts = this.input.trim().match(/(?:[^\s"]+|"[^"]*")+/g);
    const command = parts ? parts.shift()?.replace(/"/g, '') || "" : "";
    const args = parts ? parts.map(arg => arg.replace(/"/g, '')) : [];
    return { command, args };
  }
}
