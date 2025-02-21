import fs from "fs";
import path from "path";
import {EssentialBot} from "../../plugin/EssentialBot";
import {LOGGER} from "../../index";

export class KoishiImages {
  src: string;
  file: string;
  buffer: Buffer;
  mime_type: string;

  public async saveToPath(targetDir: string): Promise<{ success: boolean; fileName?: string }> {
    try {
      await fs.promises.mkdir(targetDir, {recursive: true});
    } catch (error) {
      LOGGER.error(error);
      throw new Error(error);
    }

    let files: string[];
    try {
      files = await fs.promises.readdir(targetDir);
    } catch (error) {
      throw new Error(error);
    }

    const existingFiles = files.filter(file => /^\d+\.[a-z]+$/.test(file));
    const fileNumbers = existingFiles.map(file => parseInt(file.split('.')[0], 10));
    const nextIndex = fileNumbers.length > 0 ? Math.max(...fileNumbers) + 1 : 0;

    const fileExtension = path.extname(this.file).toLowerCase();
    const newFileName = `${nextIndex}${fileExtension}`;
    const filePath = path.join(targetDir, newFileName);

    try {
      await fs.promises.writeFile(filePath, this.buffer);
      return {success: true, fileName: newFileName};
    } catch (error) {
      EssentialBot.INSTANCE.pluginLogger.error(error);
      return {success: false};
    }
  }
}
