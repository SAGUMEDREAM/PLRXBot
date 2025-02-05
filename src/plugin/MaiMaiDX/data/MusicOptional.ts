import {Networks} from "../../../core/network/Networks";
import {MusicData} from "./MusicData";
import {MaiMaiDX} from "../index";

const music_list_api = "https://www.diving-fish.com/api/maimaidxprober/music_data"
const chart_stats_api = "https://www.diving-fish.com/api/maimaidxprober/chart_stats"

export class MusicDiffData {
  values: Map<string | number, MusicData>;

  public constructor() {
    this.values = new Map<string | number, MusicData>()
  }
}

export class MusicList {
  values: Map<string | number, MusicData>;

  public constructor() {
    this.values = new Map<string | number, MusicData>()
  }

  public getById(id: number): MusicData | null {
    return this.values.get(id);
  }

  public getByName(name: string): MusicData | null {
    let sel_name_arr: string = name;
    let result: MusicData;
    for (let arr of MaiMaiDX.INSTANCE.alias) {
      if (arr.includes(name)) {
        sel_name_arr = arr;
        break;
      }
    }
    // console.log(sel_name_arr)

    this.values.forEach((music_data, key) => {
      if (result == null) {
        for (const name of sel_name_arr) {
          if (music_data.data.title.toLowerCase() == name.toLowerCase()) {
            result = music_data;
            // console.log(result)
            break;
          }
        }
      }
    })
    return result;
  }
}

export class MusicOptional {
  public list: MusicList;
  public diff_data: MusicDiffData;

  public constructor() {
    // [music_list_json, chart_stats_json] = Promise.all
    this.init();
  }

  public async init() {
    const music_list_json = await Networks.getJson(music_list_api);
    const chart_stats_json = await Networks.getJson(chart_stats_api);
    this.list = new MusicList();
    this.diff_data = new MusicDiffData()
    this.parse(music_list_json, chart_stats_json);
    await MaiMaiDX.INSTANCE.asyncLoad();
  }

  public parse(music_list_json: object[], chart_stats_json: object): void {
    music_list_json.forEach((value, index) => {
      let id = value["id"];
      let data = value;
      this.list.values.set(id, new MusicData(id, data, null))
    });

    let charts = Object.keys(chart_stats_json["charts"]);
    for (const music_id of charts) {
      if (this.list.values.has(music_id)) {
        this.list.values.get(music_id).charts = chart_stats_json["charts"][music_id]
      }
    }

    let diff_data_keys = Object.keys(chart_stats_json["diff_data"]);
    for (const key of diff_data_keys) {
      this.diff_data.values.set(key, chart_stats_json["diff_data"][key])
    }

    // console.log(this.list)
  }
}
