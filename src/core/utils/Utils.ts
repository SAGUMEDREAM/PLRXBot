import * as path from 'path';
import * as fs from 'fs';
import {Files} from "./Files";
import {parse, HTMLElement} from 'node-html-parser';

export class Utils {
  public static readonly Files = Files;
  public static root = null;
  public static fixHtmlTag(url: string): string {
    return url.replaceAll('&amp;', '&');
  }
  public static sliceArrayFrom<T>(arr: T[], m: number): T[] {
    return arr.slice(m);
  }

  public static isHtmlTag(input: string): boolean {
    const root = parse(input);
    return root.childNodes.length > 0 && root.childNodes[0] instanceof HTMLElement;
  }

  public static isImgTag(input: string): boolean {
    const root = parse(input);
    const firstNode = root.childNodes[0];

    if (firstNode instanceof HTMLElement) {
      return firstNode.tagName.toLowerCase() === 'img';
    }
    return false;
  }
  public static getImgSrc(input: string): string | null {
    const root = parse(input);
    const firstNode = root.childNodes[0];

    if (firstNode instanceof HTMLElement && firstNode.tagName.toLowerCase() === 'img') {
      return firstNode.getAttribute('src');
    }
    return null;
  }

  public static getHtmlTagObject(tags: string) {
    return parse(tags);
  }

  /*public static getHtmlObject(html: string): { [tag: string]: any[] | string } {
    try {
      const elements: { [tag: string]: any[] | string } = {};

      const $ = cheerio.load(html);
      const isValidHtml = $('*').length > 0;

      if (isValidHtml) {
        $('*').each((_, element) => {
          const tagName = element.tagName.toLowerCase();
          const attrs = $(element).attr();

          if (!elements[tagName]) {
            elements[tagName] = [];
          }

          elements[tagName].push({
            attributes: attrs,
            html: $(element).html(),
          });
        });
      } else {
        return html;
      }

      return elements;
    } catch (error) {
      return html;
    }
  }*/

  public static getRoot(): string {
    if(Utils.root == null) {
      Utils.root = Utils.findProjectRoot(__dirname);
    }
    return Utils.root;
  }

  public static findProjectRoot(cDir: string): string {
    if (fs.existsSync(path.join(cDir, 'package.json'))) {
      return cDir;
    }
    const pDir = path.dirname(cDir);
    if (pDir === cDir) {
      return "";
    }
    return Utils.findProjectRoot(pDir);
  }
}
