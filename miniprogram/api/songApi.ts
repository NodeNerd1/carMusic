import { get } from "../utils/api";
import { changeUrlQuery } from "../utils/StringHelper";

function songAvatarUrl(albumMid: string) {
  return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg?max_age=2592000`;
}

function getSongPlaySourceFileUrl(songMid: string) {
  return `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22${songMid}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`;
}

const getSongLyricUrl =
  "http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";

function getSongPlaySourceFile(songMid: string, Cookie: string) {
  return get({
    url: getSongPlaySourceFileUrl(songMid),
    header: {
      Cookie,
    },
  });
}
function _getSongLyric(songMid: string) {
  const url = changeUrlQuery(
    {
      songmid: songMid,
      pcachetime: new Date().getTime(),
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      inCharset: "utf8",
      outCharset: "utf-8",
      notice: 0,
      platform: "yqq",
      needNewCode: 0,
    },
    getSongLyricUrl
  );

  return get({
    url,
    header: {
      refereR: "https://qwe.qq.com",
    },
  }).then((res) => {
    console.log(res);
  });
}

function getSongLyric(songMid: string) {
  return wx.cloud.callFunction({
    name: "myCloudFunction",
    data: {
      type: "getSongLyric",
      songMid,
    },
  });
}

export { songAvatarUrl };
export { getSongPlaySourceFile, getSongLyric };
