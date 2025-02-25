import {Files} from "../../../core/utils/Files";
import {Constant} from "../../../core/Constant";
import path from "path";
import {EssentialBot} from "../index";

export interface MusicObject {
  name: string;
  from: string;
  path: string;
}

export interface GameObject {
  name: string;
  playlist: MusicObject[];
}

export interface THPlayListObject {
  header: string;
  data: GameObject[];
}

export class THPlayListManager {
  public assets: THPlayListObject = Files.json(
    path.resolve(Constant.ASSETS_PATH, "thplaylist.json")
  ) as THPlayListObject;

  constructor() {
    this.assets.data.forEach((game: GameObject) => {
      game.playlist.forEach((music: MusicObject) => {
        music.from = game.name;
      });
    });
  }

  /**
   * 随机获取一个音乐对象，确保 playlist 不为空
   */
  public random(): MusicObject {
    if (!this.assets.data.length) {
      EssentialBot.INSTANCE.pluginLogger.error("音乐库为空，无法随机获取音乐");
      return null;
    }

    let game: GameObject;
    do {
      game = this.assets.data[Math.floor(Math.random() * this.assets.data.length)];
    } while (game.playlist.length === 0);

    return game.playlist[Math.floor(Math.random() * game.playlist.length)];
  }

  /**
   * 根据游戏名称获取 GameObject
   */
  public getGame(keyword: string): GameObject | null {
    return this.assets.data.find(game => game.name.includes(keyword)) || null;
  }

  /**
   * 根据关键词查找所有匹配的 MusicObject
   */
  public find(keyword: string): MusicObject[] {
    return this.assets.data
      .flatMap(game => game.playlist)
      .filter(music => music.name.includes(keyword));
  }
}
