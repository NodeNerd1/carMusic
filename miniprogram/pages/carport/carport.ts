import {
  linkOnlineForm,
  componentFn,
  querySingleCollection,
} from "../../api/cloudFunctionApi";
import { playListAdd } from "../../utils/play-list-add";

const appData = getApp().globalData;
const db = wx.cloud.database();
let ownerWatchValue = null;
let memberWatchValue = null;
const BackgroundAudioManager = wx.getBackgroundAudioManager();

enum tagEnum {
  "离线",
  "成员",
  "车主",
}
Page({
  data: {
    parkingSpaceList: new Array(6),
    tagText: tagEnum[0],
    uniqueLicensePlateId: 0,
    currentFleetId: 0,
    playList: [],
    playListShow: false,
  },

  onLoad() {
    this.setData({ uniqueLicensePlateId: appData.uniqueLicensePlateId });
  },

  async becomeTap() {
    if (tagEnum[0] !== this.data.tagText) return;
    wx.showLoading({ title: "加载中", mask: true });
    const res = await linkOnlineForm({
      becomeOwner: true,
      openid: appData.openid,
      licensePlateNumber: appData.uniqueLicensePlateId,
      name: appData.user.userName,
      avatar: appData.user.userAvatar,
    });
    wx.hideLoading();
    if (!res.success) {
      wx.showToast({
        title: res.data || res.data.errMsg,
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: res.data,
      icon: "success",
    });

    this.setData({
      tagText: tagEnum[2],
    });
    this.ownerWatch();
  },

  ownerWatch() {
    this.ownerWatchValue = db
      .collection("OnlineForm")
      .where({
        _openid: appData.openid,
      })
      .watch({
        onChange: (snapshot) => {
          // add init
          console.log(snapshot);
          const { dataType, doc, updatedFields } = snapshot.docChanges[0];
          if (dataType !== "update") return;
          if (updatedFields?.Members) {
            if (doc.Members.length == 1)
              return this.setData({ parkingSpaceList: new Array(6) });
            const list = doc.Members.filter((e) => !e.owner);

            this.parkingSpaceListOperation(list);
          } else if (updatedFields?.playRepeat) {
            this.playMechanismFn("icon-repeat-one-line");
          } else if (updatedFields?.playShuffle) {
            this.playMechanismFn("icon-repeat--fill");
          } else if (updatedFields?.playRepeatOne) {
            this.playMechanismFn("icon-shuffle-fill");
          } else if (updatedFields?.skipBack) {
            this.skipFn("skipBack");
          } else if (updatedFields?.play) {
            BackgroundAudioManager.play();
          } else if (updatedFields?.paused) {
            BackgroundAudioManager.pause();
          } else if (updatedFields?.skipForward) {
            this.skipFn("skipForward");
          } else if (updatedFields && updatedFields["playthis.playthisTime"]) {
            delete doc.playthis.playthisTime;
            playListAdd([doc.playthis]);
            wx.switchTab({
              url: "/pages/play/play",
              success: function () {
                const page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.jumpPlay();
              },
            });
          } else if (updatedFields && updatedFields["playNext.playNextTime"]) {
            delete doc.playNext.playNextTime;
            wx.switchTab({
              url: "/pages/play/play",
              success: function () {
                const page = getCurrentPages().pop();
                if (page == undefined || page == null) return;

                page.playNext([doc.playNext]);
              },
            });
          }
        },
        onError: function (err) {
          console.log(err);
        },
      });
  },

  playMechanismFn(value: string) {
    wx.switchTab({
      url: "/pages/play/play",
      success: function () {
        const page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.playMechanismTap(value);
      },
    });
  },
  skipFn(value: string) {
    wx.switchTab({
      url: "/pages/play/play",
      success: function () {
        const page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        value == "skipBack" ? page.skipBack() : page.skipForward();
      },
    });
  },

  memberWatch() {
    this.memberWatchValue = db
      .collection("OnlineForm")
      .where({
        licensePlateNumber: this.data.currentFleetId,
      })
      .watch({
        onChange: (snapshot) => {
          console.log(snapshot);

          const { dataType, doc } = snapshot.docChanges[0];
          if (dataType == "update") {
            if (doc.Members.length >= 2) {
              const list = doc.Members.filter(
                (e) => e._openid !== appData.openid
              );
              this.parkingSpaceListOperation(list);
            }
          } else if (dataType == "remove") {
            this.quitExecution();
          }
        },
        onError: function (err) {
          console.log(err);
        },
      });
  },
  joinTap() {
    if (tagEnum[0] !== this.data.tagText) return;
    wx.showModal({
      title: "车队车牌号",
      editable: true,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: "加载中", mask: true });
          const value = +res.content.replace(/^\s+|\s+$/g, "");
          if (!value || value == appData.uniqueLicensePlateId) {
            wx.showToast({
              title: "请输入正确数字",
              icon: "error",
            });
            return;
          }
          const data = await linkOnlineForm({
            becomeMember: true,
            openid: appData.openid,
            licensePlateNumber: value,
            name: appData.user.userName,
            avatar: appData.user.userAvatar,
          });
          wx.hideLoading();

          if (!data.success) {
            wx.showToast({
              title: data.data || data.data.errMsg,
              icon: "error",
            });
            return;
          }

          wx.showToast({
            title: "成功加入",
            icon: "success",
          });

          this.setData({
            tagText: tagEnum[1],
            currentFleetId: value,
          });
          appData.ownerName = value;
          appData.ownerOpenId = data.ownerOpenId;

          const list = data.data.filter((e) => e._openid !== appData.openid);
          this.parkingSpaceListOperation(list);
          this.memberWatch();
        } else if (res.cancel) {
        }
      },
    });
  },
  async leaveTap(defaultBehavior = true) {
    const { tagText, currentFleetId } = this.data;
    let Parameters = {};
    if (tagEnum[2] == tagText) {
      Parameters = {
        openid: appData.openid,
        becomeOwner: false,
      };
    } else if (tagEnum[1] == tagText) {
      Parameters = {
        licensePlateNumber: currentFleetId,
        openid: appData.openid,
        becomeMember: false,
      };
    } else {
      return;
    }

    defaultBehavior && wx.showLoading({ title: "加载中", mask: true });
    const res = await linkOnlineForm(Parameters);
    defaultBehavior && wx.hideLoading();

    if (!res.success) {
      wx.showToast({
        title: res.data || res.data.errMsg,
        icon: "error",
      });
      return;
    }
    defaultBehavior &&
      wx.showToast({
        title: res.data,
        icon: "success",
      });

    this.quitExecution();
  },
  emptyTap() {},
  closeWindowTap() {
    this.setData({ playListShow: false, playList: [] });
  },
  async openListTap() {
    this.setData({ playListShow: true });
    wx.showLoading({ title: "加载中", mask: true });
    const res = await querySingleCollection(appData.ownerOpenId);
    wx.hideLoading();

    if (res.status) {
      this.setData({ playList: res.data });
    }
  },

  async play(event: WechatMiniprogram.BaseEvent) {
    const { data, item } = event.currentTarget.dataset;
    const Parameter = {
      licensePlateNumber: this.data.currentFleetId,
    };
    const value = this.data.uniqueLicensePlateId + "" + Date.now();
    if (data == "playthis") {
      item.playthisTime = value;
      Parameter.playthis = item;
    } else if (data == "playNext") {
      item.playNextTime = value;
      Parameter.playNext = item;
    }

    wx.showLoading({ title: "加载中", mask: true });
    const res = await componentFn(Parameter);
    wx.hideLoading();

    if (!res.success) {
      wx.showToast({
        title: res.data || res.data.errMsg,
        icon: "error",
      });
      return;
    }

    wx.showToast({
      title: "操作成功",
      icon: "success",
    });
    this.closeWindowTap();
  },

  async buttonOperationTap(event: WechatMiniprogram.BaseEvent) {
    const { data } = event.currentTarget.dataset;
    const Parameter = {
      licensePlateNumber: this.data.currentFleetId,
    };
    const value = this.data.uniqueLicensePlateId + "" + Date.now();
    if (data == "playRepeat") {
      Parameter.playRepeat = value;
    } else if (data == "playShuffle") {
      Parameter.playShuffle = value;
    } else if (data == "playRepeatOne") {
      Parameter.playRepeatOne = value;
    } else if (data == "skipBack") {
      Parameter.skipBack = value;
    } else if (data == "paused") {
      Parameter.paused = value;
    } else if (data == "play") {
      Parameter.play = value;
    } else if (data == "skipForward") {
      Parameter.skipForward = value;
    }

    wx.showLoading({ title: "加载中", mask: true });
    const res = await componentFn(Parameter);
    wx.hideLoading();

    if (!res.success) {
      wx.showToast({
        title: res.data || res.data.errMsg,
        icon: "error",
      });
      return;
    }

    wx.showToast({
      title: "操作成功",
      icon: "success",
    });
  },

  quitExecution() {
    this.setData({
      tagText: tagEnum[0],
      parkingSpaceList: new Array(6),
      currentFleetId: 0,
    });
    appData.ownerOpenId = "";
    appData.ownerName = 0;
    this.ownerWatchValue?.close();
    this.memberWatchValue?.close();
  },

  parkingSpaceListOperation(list) {
    if (list.length == 0) return;
    if (list.length >= 6) return this.setData({ parkingSpaceList: list });
    const value = new Array(6);
    value.splice(0, list.length, ...list);
    this.setData({ parkingSpaceList: value });
  },

  updateLicensePlate() {
    this.setData({ uniqueLicensePlateId: appData.uniqueLicensePlateId });
  },
  onReady() {},

  onUnload() {
    this.leaveTap(false);
  },

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
