import { getSongPlaySourceFile, getSongLyric } from "../../api/songApi";
import { iLikeMusicAdd, playNextAdd } from "../../utils/play-list-add";
import { addSongList } from "../../api/cloudFunctionApi";

const Lyric = require("../../utils/lyric.js");
const appData = getApp().globalData;
const BackgroundAudioManager = wx.getBackgroundAudioManager();
enum playMechanismType {
  "icon-repeat--fill",
  "icon-shuffle-fill",
  "icon-repeat-one-line",
}
Page({
  data: {
    songImage: "",
    singer: "",
    songName: "",
    albumName: "",
    songMid: "",
    currentDot: 0,
    paused: false,
    playNow: false,
    playList: [],
    playListIndex: 0,
    playMechanism: playMechanismType[0],
    currentTime: "0:00",
    duration: "0:00",
    interval: 0,
    progressValue: 0,
    randomListIndex: <number[]>[],
    disabledSlider: true,
    currentLyric: <Record<string, any> | null>null,
    currentText: "",
    currentLineNum: 0,
    toLineNum: -1,
  },

  onLoad() {
    this.playInit({ playNow: false });
  },
  onShow() {},
  jumpPlay(isRandomPlayAll = false) {
    isRandomPlayAll && this.setData({ playMechanism: playMechanismType[1] });
    this.playInit({ playNow: true });
  },
  playNext(list) {
    playNextAdd(list, this.data.playListIndex);
  },
  playInit(option, playPosition = 0) {
    const value = wx.getStorageSync("playList");
    if (value[playPosition]) {
      const {
        songImage,
        singer,
        songName,
        albumName,
        songMid,
        interval,
      } = value[playPosition];
      this.setData({
        songImage,
        singer,
        songName,
        albumName,
        songMid,
        playNow: Boolean(option.playNow),
        duration: this.formatTime(interval),
        interval,
      });
      getSongLyric(songMid);
      option.playNow && this.getPlaySourceFile(songMid);
    }
  },

  async getPlaySourceFile(songMid: string) {
    const res = await getSongPlaySourceFile(songMid, appData.Cookie);
    if (res.data) {
      const rootUrl: string = res.data.req_0.data.sip[0];
      const valueUrl: string = res.data.req_0.data.midurlinfo[0].purl;

      if (valueUrl) {
        await this.getSongLyricFn(songMid);
        this.createAudio(rootUrl + valueUrl);
      } else {
        BackgroundAudioManager.stop();
        this.setData({
          paused: false,
          disabledSlider: true,
        });
        this.emptyLyric();
        wx.showToast({
          title: "本歌曲暂时不能播放，将自动切换至下一首",
          icon: "none",
          duration: 1500,
          mask: true,
          success: () => {
            // setTimeout(() => {
            //   appData.Cookie && this.skipForward();
            // }, 1500);
          },
        });
      }
    } else {
      wx.showToast({
        title: "播放出现问题，已暂停！",
        icon: "none",
        mask: true,
      }).then(() => {
        BackgroundAudioManager.stop();
        this.setData({
          paused: false,
          disabledSlider: true,
        });
        this.emptyLyric();
      });
    }
  },

  async getSongLyricFn(songMid: string) {
    const res: any = await getSongLyric(songMid);
    if (res.result.status) {
      const lyric = this._normalizeLyric(res.result.data.lyric);
      const currentLyric = new Lyric(lyric);
      this.setData({
        currentLyric: currentLyric,
      });
    } else {
      this.emptyLyric();
    }
  },

  emptyLyric() {
    this.setData({
      currentLyric: null,
      currentText: "",
    });
  },
  handleLyric: function (currentTime: number) {
    if (!this.data.currentLyric) return;
    let lines = [
      {
        time: 0,
        txt: "",
      },
    ];

    let lyric = this.data.currentLyric;

    let lineNum = 0;
    lines = lines.concat(lyric?.lines);

    for (let i = 0; i < lines.length; i++) {
      if (i < lines.length - 1) {
        let time1 = lines[i].time,
          time2 = lines[i + 1].time;

        if (currentTime > time1 && currentTime < time2) {
          lineNum = i - 1;
          break;
        }
      } else {
        lineNum = lines.length - 2;
      }
    }

    this.setData({
      currentLineNum: lineNum,
      currentText: lines[lineNum + 1] && lines[lineNum + 1].txt,
    });

    let toLineNum = lineNum - 5;
    if (lineNum > 5 && toLineNum != this.data.toLineNum) {
      this.setData({
        toLineNum: toLineNum,
      });
    }
  },

  _normalizeLyric: function (lyric: string) {
    return lyric
      .replace(/&#58;/g, ":")
      .replace(/&#10;/g, "\n")
      .replace(/&#46;/g, ".")
      .replace(/&#32;/g, " ")
      .replace(/&#45;/g, "-")
      .replace(/&#40;/g, "(")
      .replace(/&#41;/g, ")");
  },

  createAudio(audioUrl: string) {
    const { songImage, singer, songName, albumName, currentLyric } = this.data;
    BackgroundAudioManager.src = audioUrl;
    BackgroundAudioManager.title = songName;
    BackgroundAudioManager.epname = albumName;
    BackgroundAudioManager.singer = singer;
    BackgroundAudioManager.coverImgUrl = songImage;
    this.setData({
      paused: true,
      disabledSlider: false,
    });
    BackgroundAudioManager.onPlay(() => {
      this.setData({
        paused: true,
      });
    });
    BackgroundAudioManager.onPause(() => {
      this.setData({
        paused: false,
      });
    });

    BackgroundAudioManager.onStop(() => {
      this.setData({
        paused: false,
      });
    });

    BackgroundAudioManager.onEnded(() => {
      this.skipForward();
    });

    BackgroundAudioManager.onTimeUpdate(() => {
      this.setData({
        currentTime: this.formatTime(BackgroundAudioManager.currentTime),
        progressValue: BackgroundAudioManager.currentTime,
      });
      if (currentLyric) {
        this.handleLyric(BackgroundAudioManager.currentTime * 1000);
      }
    });
  },

  progressChange(e: WechatMiniprogram.SliderChange) {
    if (!BackgroundAudioManager.src) return;
    const { value } = e.detail;
    BackgroundAudioManager.seek(value);
  },

  async togglePlayingTap() {
    const { paused, songMid, playNow } = this.data;
    if (!songMid) return;
    if (!playNow) {
      this.setData({
        playNow: true,
      });
      await this.getPlaySourceFile(songMid);
      return;
    }

    if (paused) {
      BackgroundAudioManager.pause();
      this.setData({
        paused: false,
      });
    } else {
      if (!BackgroundAudioManager.src) return;
      BackgroundAudioManager.play();
      this.setData({
        paused: true,
      });
    }
  },

  openListTap() {
    const value = wx.getStorageSync("playList");
    if (!value) return;
    const index = value.findIndex((e) => {
      return e.songMid == this.data.songMid;
    });
    this.setData({
      playList: value,
      playListIndex: index,
    });
  },
  emptyTap() {},
  playthis(e: WechatMiniprogram.BaseEvent) {
    const { index } = e.currentTarget.dataset;
    this.closeWindowTap();
    this.setData({
      playListIndex: index,
    });
    this.playInit({ playNow: true }, index);
  },
  closeWindowTap() {
    this.setData({
      playList: [],
    });
  },
  playMechanismTap(value: string) {
    switch (value || this.data.playMechanism) {
      case playMechanismType[0]:
        this.setData({
          playMechanism: playMechanismType[1],
        });
        break;
      case playMechanismType[1]:
        this.setData({
          playMechanism: playMechanismType[2],
        });
        break;
      case playMechanismType[2]:
        this.setData({
          playMechanism: playMechanismType[0],
        });
        break;
    }
  },
  skipBack() {
    const value = wx.getStorageSync("playList");
    if (!value) return;
    let goIndex = 0;
    const valueIndexes = value.length - 1;
    const { playMechanism, playListIndex, randomListIndex } = this.data;

    switch (playMechanism) {
      case playMechanismType[0]:
      case playMechanismType[2]:
        if (playListIndex !== 0) {
          goIndex = playListIndex - 1;
        } else {
          goIndex = valueIndexes;
        }
        break;
      case playMechanismType[1]:
        if (randomListIndex.length) {
          goIndex = randomListIndex[randomListIndex.length - 1];
          randomListIndex.pop();
          this.setData({
            randomListIndex: randomListIndex,
          });
        } else {
          this.skipForward();
          return;
        }

        break;
    }

    this.setData({
      playListIndex: goIndex,
    });
    this.playInit({ playNow: true }, goIndex);
  },
  skipForward() {
    const value = wx.getStorageSync("playList");
    if (!value) return;
    let goIndex = 0;
    const valueIndexes = value.length - 1;
    const { playMechanism, playListIndex, randomListIndex } = this.data;

    switch (playMechanism) {
      case playMechanismType[0]:
      case playMechanismType[2]:
        if (playListIndex !== valueIndexes) {
          goIndex = playListIndex + 1;
        }
        break;
      case playMechanismType[1]:
        goIndex = Math.floor(Math.random() * (valueIndexes + 1));
        while (goIndex === playListIndex && valueIndexes !== 0) {
          goIndex = Math.floor(Math.random() * (valueIndexes + 1));
        }
        randomListIndex.push(playListIndex);
        this.setData({
          randomListIndex: randomListIndex,
        });
        break;
    }

    this.setData({
      playListIndex: goIndex,
    });
    this.playInit({ playNow: true }, goIndex);
  },
  loveTap() {
    const {
      songName,
      songMid,
      singer,
      interval,
      albumName,
      songImage,
    } = this.data;
    if (!songMid) return;
    wx.showToast({ title: "添加成功", icon: "success" });
    iLikeMusicAdd([
      {
        songName,
        songImage,
        songMid,
        singer,
        albumName,
        interval,
      },
    ]);
  },
  collectionTap() {
    const {
      songName,
      songMid,
      singer,
      interval,
      albumName,
      songImage,
    } = this.data;
    if (!songMid) return;
    const nameList = appData.collectionList.map((e) => e.name);
    if (appData.ownerOpenId) {
      nameList.push("车队 " + appData.ownerName + " " + "的默认收藏");
    }
    wx.showActionSheet({
      itemList: nameList,
      success: async (res) => {
        wx.showLoading({ title: "加载中", mask: true });
        const value = await addSongList(
          appData.ownerOpenId
            ? {
                _openid: appData.ownerOpenId,
                songList: [
                  {
                    songName,
                    songImage,
                    songMid,
                    singer,
                    albumName,
                    interval,
                  },
                ],
              }
            : {
                id: appData.collectionList[res.tapIndex]._id,
                songList: [
                  {
                    songName,
                    songImage,
                    songMid,
                    singer,
                    albumName,
                    interval,
                  },
                ],
              }
        );
        wx.hideLoading();

        if (value.status) {
          wx.showToast({
            title: value.data,
            icon: "success",
          });
        } else {
          wx.showToast({
            title: value.data || value.data.errMsg,
            icon: "error",
          });
        }
      },
    });
  },

  changeEvent(e: WechatMiniprogram.SwiperChange) {
    this.setData({
      currentDot: e.detail.current,
    });
  },

  formatTime(interval: number = 0) {
    interval = interval | 0;
    const minute = (interval / 60) | 0;
    const second = this.pad(interval % 60);
    return `${minute}:${second}`;
  },

  pad(num: number | string, n = 2) {
    let len = num.toString().length;
    while (len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
