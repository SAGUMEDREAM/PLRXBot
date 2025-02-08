import {Utils} from "./utils/Utils";
import {CommandManager} from "./command/CommandManager";
import {UserManager} from "./user/UserManager";
import path from "path";
import {Config} from "./data/Config";
import {GroupManager} from "./group/GroupManager";
import {LOGGER} from "../index";

export interface core_config {
  "config": {
    "owner": "",
    "enabled_command_at_parse_feature": boolean
  },
  "server": {
    "bind_address": "0.0.0.0",
    "port": 3000
  }
}

export class Constant {
  public static PATH: string;
  public static ASSETS_PATH: string;
  public static DATA_PATH: string;
  public static PLUGIN_PATH: string;
  public static USER_DATA_PATH: string;
  public static GROUP_DATA_PATH: string;
  public static LANGUAGE_PATH: string;
  public static CONFIG_FILE_PATH: string;
  public static CACHES_PATH: string;
  public static COMMON_HEADER: string;
  public static COMMAND_MANAGER: CommandManager;
  public static USER_MANAGER: UserManager;
  public static GROUP_MANAGER: GroupManager;
  public static CONFIG: Config<core_config>;
  public static NODEJS_TYPESCRIPT_ENVIRONMENT: boolean;

  public static init(): void {
    LOGGER.info("Loading Constants...")
    this.PATH = String(Utils.getRoot());
    this.ASSETS_PATH = path.join(Utils.getRoot(), 'assets');
    this.DATA_PATH = path.join(Utils.getRoot(), 'data');
    this.PLUGIN_PATH = path.join(Utils.getRoot(), 'plugins');
    this.USER_DATA_PATH = path.join(Utils.getRoot(), 'data', 'profile');
    this.GROUP_DATA_PATH = path.join(Utils.getRoot(), 'data', 'group');
    this.LANGUAGE_PATH = path.join(Utils.getRoot(), 'data', 'lang');
    this.CONFIG_FILE_PATH = path.join(Utils.getRoot(), 'data', 'config.json');
    this.CACHES_PATH = path.join(Utils.getRoot(), 'data', 'caches');
    this.COMMAND_MANAGER = CommandManager.create();
    this.COMMON_HEADER = "@kisin-reimu";
    this.USER_MANAGER = UserManager.create();
    this.GROUP_MANAGER = GroupManager.create();
    this.CONFIG = new Config(Constant.CONFIG_FILE_PATH, {
      "config": {
        "owner": "",
        "enabled_command_at_parse_feature": true
      },
      "server": {
        "bind_address": "0.0.0.0",
        "port": 3000
      }
    }, true);
    this.NODEJS_TYPESCRIPT_ENVIRONMENT = !!process[Symbol.for('ts-node.register.instance')];
    if (!this.NODEJS_TYPESCRIPT_ENVIRONMENT) {
      LOGGER.warn(`This plugin needs to be run in TypeScript, otherwise some unknown errors may occur`)
    }
    // console.log(this.NODEJS_TYPESCRIPT_ENVIRONMENT)
    LOGGER.info(`Set the root directory to ${this.PATH}`)
    LOGGER.info("Serialization Configuration...");
  };
}
