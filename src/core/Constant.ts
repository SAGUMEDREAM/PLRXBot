import {Utils} from "./utils/Utils";
import {CommandManager} from "./command/CommandManager";
import {UserManager} from "./user/UserManager";
import path from "path";
import {Config} from "./data/Config";
import {GroupManager} from "./group/GroupManager";
import {LOGGER} from "../index";

export class Constant {
  public static PATH: string;
  public static DATA_PATH: string;
  public static PLUGIN_PATH: string;
  public static USER_DATA_PATH: string;
  public static GROUP_DATA_PATH: string;
  public static LANGUAGE_PATH: string;
  public static CONFIG_FILE_PATH: string;
  public static CACHES_PATH: string;
  public static COMMAND_MANAGER: CommandManager;
  public static USER_MANAGER: UserManager;
  public static GROUP_MANAGER: GroupManager;
  public static CONFIG: Config;
  public static init(): void {
    LOGGER.info("Loading Constants...")
    this.PATH = String(Utils.getRoot());
    this.DATA_PATH = path.join(Utils.getRoot(), 'data');
    this.PLUGIN_PATH = path.join(Utils.getRoot(), 'plugins');
    this.USER_DATA_PATH  = path.join(Utils.getRoot(), 'data', 'profile');
    this.GROUP_DATA_PATH  = path.join(Utils.getRoot(), 'data', 'group');
    this.LANGUAGE_PATH  = path.join(Utils.getRoot(), 'data', 'lang');
    this.CONFIG_FILE_PATH = path.join(Utils.getRoot(), 'data', 'config.json')
    this.CACHES_PATH = path.join(Utils.getRoot(), 'data', 'caches')
    this.COMMAND_MANAGER = CommandManager.create();
    this.USER_MANAGER = UserManager.create();
    this.GROUP_MANAGER = GroupManager.create();
    this.CONFIG = new Config();
  };
}
