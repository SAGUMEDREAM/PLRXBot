import fs from "fs";
import path from "path";

export class Files {
  public static exists(_path: string): boolean {
    return fs.existsSync(_path);
  }

  public static delete(_path: string): boolean {
    try {
      fs.unlinkSync(_path);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static read(_path: string): string {
    const dir = path.dirname(_path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }

    try {
      return fs.readFileSync(_path, 'utf8');
    } catch (error) {
      return '';
    }
  }

  public static readCSV(_path: string): string[][] {
    try {
      const fst = Files.read(_path);
      return fst
        .split(/\r?\n/)
        .filter(row => row)
        .map(row => row.split(','));
    } catch (error) {
      return [];
    }
  }

  public static write(_path: string, _data: string): boolean {
    try {
      fs.writeFileSync(_path, _data);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static createDir(_path: string): boolean {
    try {
      fs.mkdirSync(_path, {recursive: true});
      return true;
    } catch (error) {
      return false;
    }
  }

  public static getOrCreateDir(_path: string): string[] {
    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path, {recursive: true});
    }
    const files: string[] = fs.readdirSync(_path);
    const paths: string[] = [];
    files.forEach((filename: string) => {
      paths.push(path.join(_path, filename));
    });
    return paths;
  }

  public static deleteDir(_path: string): boolean {
    try {
      fs.rmSync(_path, {recursive: true, force: true});
      return true;
    } catch (error) {
      return false;
    }
  }

  public static getFileName(_path: string): string {
    const bn = path.basename(_path);
    const ext = path.extname(bn);
    return bn.slice(0, -ext.length);
  }

  public static getDir(_path: string): string[] {
    const files: string[] = fs.readdirSync(_path);
    const paths: string[] = [];
    files.forEach((filename: string) => {
      paths.push(path.join(_path, filename))
    })
    return paths;
  }
}
