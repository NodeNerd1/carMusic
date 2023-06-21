import {
  queryCollection,
  createCollection,
  deleteCollection,
} from "../../api/cloudFunctionApi";
const appData = getApp().globalData;
Page({
  data: {
    backgroundImage: "",
    collectionList: [],
    delete: false,
  },

  onLoad() {
    this.setData({
      backgroundImage: appData.user.userAvatar,
    });

    this.queryCollectionFn();
  },

  async queryCollectionFn() {
    const res = await queryCollection(appData.openid);
    this.setData({
      collectionList: res,
    });
    appData.collectionList = res;
  },

  createCollectionFn() {
    wx.showModal({
      title: "创建收藏",
      editable: true,
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: "加载中", mask: true });
          const value = res.content.replace(/^\s+|\s+$/g, "");
          if (!value) {
            wx.showToast({
              title: "请输入",
              icon: "error",
            });
            return;
          }
          const data = await createCollection({
            name: value,
            openid: appData.openid,
          });
          wx.hideLoading();
          if (data.status) {
            wx.showToast({
              title: data.data,
              icon: "success",
            });
            this.queryCollectionFn();
          } else {
            wx.showToast({
              title: data.data || data.data.errMsg,
              icon: "none",
            });
          }
        } else if (res.cancel) {
        }
      },
    });
  },
  deleteAction() {
    this.setData({ delete: !this.data.delete });
  },

  deleteCollectionFn(event: WechatMiniprogram.BaseEvent) {
    const { name, _id } = event.currentTarget.dataset.item;
    if (name === "默认收藏") return;
    wx.showModal({
      title: "确认要删除吗?",
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: "加载中", mask: true });

          const data = await deleteCollection(_id);
          wx.hideLoading();
          if (data.status) {
            wx.showToast({
              title: data.data,
              icon: "success",
            });
            this.queryCollectionFn();
          } else {
            wx.showToast({
              title: data.data || data.data.errMsg,
              icon: "error",
            });
          }

          wx.hideLoading();
        } else if (res.cancel) {
        }
      },
    });
  },
  goDetails(event: WechatMiniprogram.BaseEvent) {
    const { item, index } = event.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/detail-list/detail-list",
      success: (res) => {
        res.eventChannel.emit("getSingerItem", {
          name: item.name,
          avatar: item.songList[0]?.songImage || appData.user.userAvatar,
          data: {
            data: item.songList,
          },
          love: true,
          collectionStatus: true,
          collectionIndex: index,
          collectionId: item._id,
        });
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
