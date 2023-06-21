import { getSingerSongList } from "../../api/singerApi";
import { getTopMusicList } from "../../api/recommendApi";
import { addSongList, deleteSongList } from "../../api/cloudFunctionApi";
import {
  playListAdd,
  iLikeMusicAdd,
  iLikeMusicDelete,
  filterList,
} from "../../utils/play-list-add";
const appData = getApp().globalData;
Page({
  data: {
    backgroundImage: "",
    singerSongList: [],
    collection: false,
    love: false,
    deleteSwitch: false,
    collectionStatus: false,
    collectionIndex: 0,
    collectionId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("getSingerItem", async (data) => {
      this.setData({
        backgroundImage: data.avatar || appData.user.userAvatar,
      });
      wx.setNavigationBarTitle({ title: data.name });

      let res;
      if (data.mid) {
        res = await getSingerSongList(data.mid);
        res.data = filterList(res.data);
      } else if (data.topId) {
        res = await getTopMusicList(data.topId);
        res.data = filterList(res.data);
      } else if (data.love && !data.collectionStatus) {
        res = data.data;
        this.setData({ love: true });
      } else if (data.love && data.collectionStatus) {
        res = data.data;
        this.setData({
          love: true,
          collectionStatus: true,
          collectionIndex: data.collectionIndex,
          collectionId: data.collectionId,
        });
      }

      this.setData({
        singerSongList: res.data,
      });
    });
  },

  buttonSwitchTap() {
    if (this.data.love) {
      this.setData({ deleteSwitch: !this.data.deleteSwitch });
    } else {
      this.setData({ collection: !this.data.collection });
    }
  },
  randomPlayAll() {
    if (this.data.singerSongList.length == 0) return;
    playListAdd(this.data.singerSongList);
    wx.switchTab({
      url: "/pages/play/play",
      success: function () {
        const page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.jumpPlay(true);
      },
    });
  },
  buttonActionTap(event: WechatMiniprogram.BaseEvent) {
    const { data } = event.currentTarget.dataset;
    if (this.data.collection) {
      this.collectionFn(data);
    } else {
      this.loveFn(data);
    }
  },

  loveFn(list) {
    wx.showToast({ title: "添加成功", icon: "success" });
    iLikeMusicAdd([list]);
  },

  collectionFn(item) {
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
                songList: [item],
              }
            : {
                id: appData.collectionList[res.tapIndex]._id,
                songList: [item],
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
      fail(res) {},
    });
  },
  deleteButtonActionTap(event: WechatMiniprogram.BaseEvent) {
    const { data, index } = event.currentTarget.dataset;

    if (this.data.deleteSwitch) {
      const { singerSongList, backgroundImage } = iLikeMusicDelete(index);
      wx.showToast({ title: "删除成功", icon: "success" });
      backgroundImage
        ? this.setData({ singerSongList, backgroundImage })
        : this.setData({
            singerSongList,
            backgroundImage: appData.user.userAvatar,
          });
    } else {
      this.collectionFn(data);
    }
  },

  async collectionButtonActionTap(event: WechatMiniprogram.BaseEvent) {
    const { data } = event.currentTarget.dataset;
    const { collectionId, collectionIndex } = this.data;

    if (this.data.deleteSwitch) {
      wx.showLoading({ title: "加载中", mask: true });

      const res = await deleteSongList({ id: collectionId, songList: [data] });
      wx.hideLoading();
      if (res.status) {
        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
        this.setData({
          singerSongList: res.data,
          backgroundImage:
            res.data.length === 0
              ? appData.user.userAvatar
              : res.data[0].songImage,
        });

        appData.collectionList[collectionIndex].songList = res.data;
      } else {
        wx.showToast({
          title: res.data || res.data.errMsg,
          icon: "none",
        });
      }
    } else {
      this.loveFn(data);
    }
  },

  playMusicTap(e: WechatMiniprogram.BaseEvent) {
    const { data } = e.currentTarget.dataset;
    playListAdd([data]);
    wx.switchTab({
      url: "/pages/play/play",
      success: function () {
        const page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.jumpPlay();
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
