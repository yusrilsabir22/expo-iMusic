import { music_URL } from "../utils/constants";

// const URL = 'http://music.blondev.my.id/';

export default class Service {
  static async GET(path: string) {
    let response = await fetch(music_URL + path, {
      method: 'GET',
    });
    let res = await response.json();
    return {
      data: res,
      status: response.status,
    };
  }

}
