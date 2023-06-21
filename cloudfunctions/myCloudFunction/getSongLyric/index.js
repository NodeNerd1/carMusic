const axios = require('axios').default;
const Base64 = require('js-base64');

const getSongLyricUrl =
  "http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";

exports.main = async (event, context) => {
  try {
    const res = await axios(getSongLyricUrl, {
      params: {
        songmid: event.songMid,
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
      headers: {
        'Referer': 'https://c.qq.com',
      },
    });
    if (typeof res.data === 'string') {
      res.data = res.data.replace(
        /callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g,
        '',
      );
      res.data = JSON.parse(res.data)
      res.lyric = Base64.Base64.decode(res.data.lyric)
      res.trans = Base64.Base64.decode(res.data.trans)
    }
    return {
      data: {
        lyric: res.lyric,
        trans: res.trans
      },
      status: true
    }
  } catch (error) {
    return {
      status: false,
      errMsg: error
    }
  }
};