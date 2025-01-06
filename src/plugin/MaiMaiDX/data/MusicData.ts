export abstract class music_basic_info {
  public abstract title: string;
  public abstract artist: string;
  public abstract genre: string;
  public abstract bpm: number;
  public abstract release_date: string;
  public abstract from: boolean;
  public abstract is_new: boolean;
}

export abstract class music_chart {
  public abstract notes: number[];
  public abstract charter: string;
}

export abstract class music_data {
  public abstract id: string;
  public abstract title: string;
  public abstract type: string;
  public abstract level: string[];
  public abstract cid: string[];
  public abstract basic_info: music_basic_info;
  public abstract charts: music_chart[];
}

export abstract class charts_object {
  public abstract cnt: number;        // 游玩次数
  public abstract diff: number;       // 难度
  public abstract fit_diff: number;   // 修正难度
  public abstract avg: number;        // 全服平均完成率
  public abstract avg_dx: number;     // 全服平均dx分
  public abstract std_dev: number;    // 达成 SSS 率
  public abstract dist: number[];     //
  public abstract fc_dist: number[];  // Full Combo分布
}

export class MusicData {
  public music_id: string;
  public data: music_data;
  public charts: charts_object;
  public constructor(music_id: string, data: any, charts: any) {
    this.music_id = music_id
    this.data = data;
    this.charts = charts;
  }
}
