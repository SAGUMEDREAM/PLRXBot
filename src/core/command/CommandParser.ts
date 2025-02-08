import { h, Element } from "koishi";

export class CommandParser {
  public input: string;

  constructor(input: string) {
    this.input = input;
  }

  public parse(): { command: string, args: (string | h)[], raw: string } {
    const elements = h.parse(this.input);

    let command = "";
    let args: (string | h)[] = [];

    elements.forEach((element, index) => {
      if (index == 0 && element.type == "text") {
        command = element.attrs.content.trim().split(/\s+/)[0] || "";
        const remainingText = element.attrs.content.trim().slice(command.length).trim();
        if (remainingText) {
          args.push(remainingText);
        }
      } else {
        args.push(element);
      }
    });

    const raw = elements
      .map(element => {
        if (element.type === "text") {
          return element.attrs.content;
        } else {
          return h(element.type, element.attrs, ...element.children || []);
        }
      })
      .join("");

    // console.log({ command, args, raw })
    return { command, args, raw };
  }

}
