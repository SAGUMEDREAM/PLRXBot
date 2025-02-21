import * as path from 'path';
import * as fs from 'fs';
import {Files} from "./Files";
import {HTMLElement, parse} from 'node-html-parser';
import {configOptional} from "../../index";

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

  public static getRoot(): string {
    if (Utils.root == null) {
      const cfgPathValue = configOptional.value.rootPath;
      const cfgPath = cfgPathValue == "D:\\example\\bot" ? null : cfgPathValue
      Utils.root = cfgPath != null && Files.exists(cfgPath)
        ? path.join(configOptional.value.rootPath)
        : Utils.findProjectRoot(__dirname);
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
