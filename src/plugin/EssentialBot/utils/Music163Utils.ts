import axios from "axios";

export interface PlayListData {
  code: number,
  result: {
    "subscribers": [],
    "subscribed": boolean,
    "creator": {
      avatarUrl: string,
      userId: number,
      nickname: string,
      signature: string
    },
    artists: string,
    "tracks": {
      name: string,
      id: number,
      alias: string[],
      duration: number,
      artists: {
        "name": string,
        "id": number,
        "img1v1Url": string,
      }
      album: {
        name: string,
        id: number,
        size: number
        picUrl: string,
        description: string,
        tags: string,
        publishTime: number,
        company: string,
      }
    }[],
    updateTime: number,
    coverImgUrl: string,
    trackCount: number,
    description: string,
    tags: string[],
    name: string,
    id: number
  }
}

export interface MusicData {
  id: number,
  src: string
  name: string,
  singer: string,
  time: number
}

export class Music163Utils {
  public static async getPlayList(list_id: string | number) {
    if (typeof list_id == "number") {
      list_id = String(list_id);
    }
    const result = await this.getPlayListInfo(list_id);
    if (result) {
      const list: MusicData[] = result.tracks.map((item) => {
        return {
          id: item.id,
          src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          name: item.name,
          singer: item.artists[0].name,
          time: item.duration
        };
      });
      return list;
    } else {
      return null;
    }
  }

  public static async getPlayListInfo(list_id: string | number) {
    if (typeof list_id == "number") {
      list_id = String(list_id);
    }
    const response = await axios.get(`https://music.163.com/api/playlist/detail?id=${list_id}`);
    const data: PlayListData = response.data;
    if (data.code == 200) {
      return data.result;
    } else {
      return null;
    }
  }

  public static getSrc(music_id: string | number) {
    if (typeof music_id == "number") {
      music_id = String(music_id);
    }
    return `https://music.163.com/song/media/outer/url?id=${music_id}.mp3`;
  }

  public static getRandomUserAgent() {
    const userAgentList = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
      "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
      "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
      "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"
    ];
    const num = Math.floor(Math.random() * userAgentList.length);
    return userAgentList[num];
  }
}
