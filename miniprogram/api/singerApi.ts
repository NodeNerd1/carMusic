import { get } from "../utils/api";
import { changeUrlQuery } from "../utils/StringHelper";
//1-100
const getSingerListUrl =
  "https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=callback";

const getSingerSongListUrl = "http://u.y.qq.com/cgi-bin/musicu.fcg";

function singerAvatarUrl(mid: string) {
  return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`;
}

type ListType = {
  Farea: string;
  Fattribute_3: string;
  Fattribute_4: string;
  Fgenre: string;
  Findex: string;
  Fother_name: string;
  Fsinger_id: string;
  Fsinger_mid: string;
  Fsinger_name: string;
  Fsinger_tag: string;
  Fsort: string;
  Ftrend: string;
  Ftype: string;
  voc: string;
}[];
type GetSingerListType = {
  data?: {
    code: number;
    data: {
      list: ListType;
      per_page: number;
      total: number;
      total_page: number;
    };
    message: string;
    subcode: number;
  };
} & DataType;

function getSingerList() {
  return get({ url: getSingerListUrl }).then((res) => {
    if (typeof res.data == "string") {
      let res1 = res.data.replace("callback(", "");
      let res2 = JSON.parse(res1.substring(0, res1.length - 1));
      res.data = res2;
    }
    return res as GetSingerListType;
  });
}

function getSingerSongList(mid: string) {
  const url = changeUrlQuery(
    {
      data: JSON.stringify({
        comm: {
          ct: 24,
          cv: 0,
        },
        singer: {
          method: "get_singer_detail_info",
          param: {
            sort: 5,
            singermid: mid,
            sin: 1,
            num: 50,
          },
          module: "music.web_singer_info_svr",
        },
      }),
    },
    getSingerSongListUrl
  );
  return get({ url }).then((res) => {
    if (res.data) {
      res.data = (res.data as Record<string, any>).singer.data.songlist;
    }
    return res;
  });
}
export { singerAvatarUrl, ListType };
export { getSingerList, getSingerSongList };
