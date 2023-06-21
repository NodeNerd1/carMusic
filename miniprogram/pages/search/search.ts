import { getHotSearch, getSearch, getSongDetails } from "../../api/searchApi";
import { antiShaking } from "../../utils/utils";
import { singerAvatarUrl } from "../../api/singerApi";
import { playListAdd, filterList } from "../../utils/play-list-add";

type HotSearchType = {
  k: string;
  n: number;
}[];

Page({
  data: {
    hotSearch: <HotSearchType>[],
    fn: null,
    value: "",
    historySearchList: <string[]>[],
    result: false,
    singers: [],
    songs: [],
  },

  onLoad() {
    this.getHotSearchFn();
    this.getHistorySearch();
    this.setData({
      fn: antiShaking(this.goSearch, 1500),
    });
  },

  async getHotSearchFn() {
    const res = await getHotSearch();
    if (res.data) {
      this.setData({
        hotSearch: res.data.length > 10 ? res.data.slice(0, 10) : res.data,
      });
    }
  },

  searchAction(e: WechatMiniprogram.BaseEvent) {
    const { txt } = e.currentTarget.dataset;
    const { value } = this.data;
    if (txt) {
      this.setData({
        value: txt,
      });
      this.goSearch();
    } else {
      const valueText = value.replace(/^\s+|\s+$/g, "");
      if (!valueText) {
        this.setData({ result: false });
        this.getHistorySearch();
        return;
      }
      this.data.fn();
    }
  },
  async goSearch() {
    const { value } = this.data;
    if (!value) return;
    const finallyValue = value.replace(/^\s+|\s+$/g, "");
    const res = await getSearch(finallyValue);
    if (res.data) {
      this.dealData(res.data.data);
      this.addHistorySearch(finallyValue);
    }
  },

  dealData: function (data) {
    if (!data) {
      this.setData({ result: false });
      this.getHistorySearch();
      return;
    }
    this.setData({ result: true });
    data.singer
      ? this.setData({
          singers: data.singer.itemlist,
        })
      : this.setData({
          singers: [],
        });
    data.song
      ? this.setData({
          songs: data.song.itemlist,
        })
      : this.setData({
          songs: [],
        });
  },
  getHistorySearch() {
    this.setData({
      historySearchList: wx.getStorageSync("historySearch") || [],
    });
  },
  addHistorySearch(keyWrod: string) {
    let history = wx.getStorageSync("historySearch");
    if (history) {
      if (!history.includes(keyWrod)) {
        history.unshift(keyWrod);
        wx.setStorageSync("historySearch", history);
      }
    } else {
      wx.setStorageSync("historySearch", [keyWrod]);
    }
  },
  deleteHistorySearch(e: WechatMiniprogram.BaseEvent) {
    const { index } = e.currentTarget.dataset;
    const value = wx.getStorageSync("historySearch");
    if (index) {
      value.splice(index, 1);
      wx.setStorageSync("historySearch", value);
    } else {
      wx.setStorageSync("historySearch", []);
    }
    this.getHistorySearch();
  },
  goSinger(event: WechatMiniprogram.BaseEvent) {
    const { mid, name } = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/detail-list/detail-list",
      success: function (res) {
        res.eventChannel.emit("getSingerItem", {
          mid,
          name,
          avatar: singerAvatarUrl(mid),
        });
      },
    });
  },

  async selectSong(event: WechatMiniprogram.BaseEvent) {
    const { mid } = event.currentTarget.dataset;
    const res = await getSongDetails(mid);

    if (res.data) {
      playListAdd(filterList([res.data]));
      wx.switchTab({
        url: "/pages/play/play",
        success: function () {
          const page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.jumpPlay();
        },
      });
    }
  },

  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
