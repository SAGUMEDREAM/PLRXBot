import axios from "axios";

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

  public static async get(_url: string) {
    try {
      const request = await axios.get(_url, {
        headers: {'Content-Type': 'application/json'}
      })
      // const res = request('GET', _url, {headers: {'Content-Type': 'application/json'}});
      return request.data;
    } catch (err) {
      return null;
    }
  }

  public static async post(_url: string, payload: object = {}) {
    try {
      // const res = request('POST', _url, payload);
      // return JSON.parse(res.getBody('utf8'));
      const request = await axios.post(_url, payload)
      return request.data;
    } catch (err) {
      return null;
    }
  }

  public static async getJson(_url: string) {
    try {
      // const res = request('GET', _url, {headers: {'Content-Type': 'application/json'}});
      // return JSON.parse(res.getBody('utf8'));
      const request = await axios.get(_url, {
        headers: {'Content-Type': 'application/json'}
      })
      return request.data;
    } catch (error) {
      console.error('Error during request:', error);
      return null;
    }
  }
}
