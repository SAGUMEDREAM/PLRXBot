import request from "sync-request";

const ping = require("ping");

export class Networks {
  public static async ping(target: string): Promise<number> {
    try {
      const res = await ping.promise.probe(target);
      return res.time ? res.time : -1;
    } catch (error) {
      return -1;
    }
  }
  public static getJson(_url: string): any {
    try {
      const res = request('GET', _url, { headers: { 'Content-Type': 'application/json' } });
      return JSON.parse(res.getBody('utf8'));
    } catch (error) {
      console.error('Error during request:', error);
      return null;
    }
  }
}
