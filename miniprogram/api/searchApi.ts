import { get } from "../utils/api";

const getHotSearchUrl =
  "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&jsonpCallback=hotSearchKeysmod_top_search&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0";

function getSearchUrl(key: string) {
  return `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?is_xml=0&format=jsonp&key=${key}&g_tk=5381&jsonpCallback=SmartboxKeysCallbackmod_top_search3847&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
}

const getSongDetailsUrl = "https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg"

function getHotSearch() {
  return get({
    url: getHotSearchUrl,
  }).then((res) => {
    if (res.data) {
      let res1 = res.data.replace("hotSearchKeysmod_top_search(", "");
      let res2 = JSON.parse(res1.substring(0, res1.length - 1));
      if (res2.code === 0) {
        let hotArr = res2.data.hotkey;
        hotArr.forEach((element) => {
          element.k = element.k.replace(/ $/, "");
        });
        res.data = hotArr;
        return res;
      }
    }
    return res;
  });
}

function getSearch(key: string) {
  return get({
    url: getSearchUrl(key),
  }).then((res) => {
    if (res.data) {
      let res1 = res.data.replace(
        "SmartboxKeysCallbackmod_top_search3847(",
        ""
      );
      let res2 = JSON.parse(res1.substring(0, res1.length - 1));
      res.data = res2;
      return res;
    }
    return res;
  });
}

function getSongDetails(mid:string) {
   return get({url: getSongDetailsUrl ,  data: {
    songmid: mid,
    tpl: 'yqq_song_detail',
    format: 'jsonp',
    callback: 'getOneSongInfoCallback',
    g_tk: 5381,
    jsonpCallback: 'getOneSongInfoCallback',
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  },
  }).then(res=>{
    if(res.data){
      let res1 = res.data.replace('getOneSongInfoCallback(', '')
      let res2 = JSON.parse(res1.substring(0, res1.length - 1)).data[0]
      res.data = res2
      return res
    }
    return res
  })
}

export { getHotSearch, getSearch  ,getSongDetails};
