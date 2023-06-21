import { get } from "../utils/api";
const slider = [
  {
    picUrl:
      "https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/4634735.jpg?max_age=2592000",
  },
  {
    picUrl:
      "https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/4636015.jpg?max_age=2592000",
  },
  {
    picUrl:
      "https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/4636556.jpg?max_age=2592000",
  },
  {
    picUrl:
      "https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/4637123.jpg?max_age=2592000",
  },
  {
    picUrl:
      "https://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/4636586.png?max_age=2592000",
  },
];
const getRecommendListUrl =
  "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=jp1";

function getTopMusicListUrl(topid: number) {
  return `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${topid}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp1`;
}

type RecommendListType = {
  data?: {
    code: number;
    data: {
      topList: {
        id: number;
        listenCount: number;
        picUrl: string;
        songList: { singername: string; songname: string }[];
        topTitle: string;
        type: number;
      }[];
    };
    default: number;
    message: string;
    subcode: number;
  };
} & DataType;

function getRecommendList() {
  return get({
    url: getRecommendListUrl,
  }).then((res) => {
    if (typeof res.data == "string") {
      let res1 = res.data.replace("jp1(", "");
      let res2 = JSON.parse(res1.substring(0, res1.length - 1));
      res.data = res2;
    }
    return res as RecommendListType;
  });
}

function getTopMusicList(topid: number) {
  return get({
    url: getTopMusicListUrl(topid),
  }).then((res) => {
    if (res.data) {
      var res1 = res.data.replace("jp1(", "");
      var res2 = JSON.parse(res1.substring(0, res1.length - 1));

      let songlist = res2.songlist.filter((e) => e.data);

      res.data = songlist.map((e) => {
        return {
          name: e.data.songname,
          mid: e.data.songmid,
          album: {
            mid: e.data.albummid,
            name: e.data.albumname,
          },
          singer: e.data.singer,
          interval: e.data.interval,
        };
      });
      return res;
    }
    return res;
  });
}

export { slider, getRecommendList, getTopMusicList };
