import {Jimp} from "jimp";
import {OtomadHelper} from "../index";
import {h} from "koishi";

export class ImageUtils {
  public static async generateAvatar(framePath: string, imageUrl: string): Promise<h> {
    try {
      const userAvatar = await Jimp.read(imageUrl);
      const frame = await Jimp.read(framePath);
      const canvas = new Jimp({width: frame.width, height: frame.height});

      const size = Math.min(userAvatar.width, userAvatar.height);
      userAvatar.cover({w: size, h: size});
      userAvatar.resize({w: 854, h: 854});
      canvas.composite(userAvatar, 158, 190);
      canvas.composite(frame, 0, 0);

      const buffer = await canvas.getBuffer("image/png");

      return h.image(buffer, "image/png");
    } catch (error) {
      OtomadHelper.INSTANCE.pluginLogger.error(`图片合成失败:`);
      OtomadHelper.INSTANCE.pluginLogger.error(error);
      throw new Error('图片合成失败');
    }
  }

  public static async imsoHappy(imageBuffer: Buffer, direction: boolean = true): Promise<Buffer> {
    const image = await Jimp.read(imageBuffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    const newImage = new Jimp({width, height});

    const centerX = width / 2;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let mirroredX: number;

        if (direction) {
          mirroredX = x < centerX ? x : 2 * centerX - x - 1;
        } else {
          mirroredX = x >= centerX ? x : 2 * centerX - x - 1;
        }

        const color = image.getPixelColor(mirroredX, y);

        newImage.setPixelColor(color, x, y);
      }
    }

    return await newImage.getBuffer("image/png");
  }

  public static async spherical(imageBuffer: Buffer): Promise<Buffer> {
    const image = await Jimp.read(imageBuffer);
    const width = image.width;
    const height = image.height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    const newImage = new Jimp({width, height});

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          const factor = Math.sqrt(1 - (distance / radius) ** 2);
          const srcX = Math.floor(centerX + dx * factor);
          const srcY = Math.floor(centerY + dy * factor);

          if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
            const color = image.getPixelColor(srcX, srcY);
            newImage.setPixelColor(color, x, y);
          }
        }
      }
    }

    return await newImage.getBuffer("image/png");
  }

  public static async fisheye(imageBuffer: Buffer, intensity = 1.2): Promise<Buffer> {
    const image = await Jimp.read(imageBuffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    const newImage = new Jimp({width, height});

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const factor = Math.pow(distance / radius, intensity);
        const srcX = Math.floor(centerX + dx * factor);
        const srcY = Math.floor(centerY + dy * factor);

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const color = image.getPixelColor(srcX, srcY);
          newImage.setPixelColor(color, x, y);
        } else {
          const edgeX = Math.min(Math.max(srcX, 0), width - 1);
          const edgeY = Math.min(Math.max(srcY, 0), height - 1);
          const color = image.getPixelColor(edgeX, edgeY);
          newImage.setPixelColor(color, x, y);
        }
      }
    }

    return await newImage.getBuffer("image/png");
  }

  public static async defisheye(imageBuffer: Buffer, intensity = 1.2): Promise<Buffer> {
    const image = await Jimp.read(imageBuffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    const newImage = new Jimp({width, height});

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 反球面化的核心：将拉伸的像素映射回原始位置
        if (distance <= radius) {
          const factor = Math.pow(distance / radius, 1 / intensity); // 反向计算因子
          const srcX = Math.floor(centerX + dx * factor);
          const srcY = Math.floor(centerY + dy * factor);

          if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
            const color = image.getPixelColor(srcX, srcY);
            newImage.setPixelColor(color, x, y);
          } else {
            // 如果超出范围，使用边缘像素的颜色
            const edgeX = Math.min(Math.max(srcX, 0), width - 1);
            const edgeY = Math.min(Math.max(srcY, 0), height - 1);
            const color = image.getPixelColor(edgeX, edgeY);
            newImage.setPixelColor(color, x, y);
          }
        } else {
          // 如果超出半径范围，直接使用原图像素
          const color = image.getPixelColor(x, y);
          newImage.setPixelColor(color, x, y);
        }
      }
    }

    return await newImage.getBuffer("image/png");
  }
}
