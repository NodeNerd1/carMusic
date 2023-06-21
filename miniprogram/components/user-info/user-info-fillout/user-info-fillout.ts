import { uploadUserAvatars } from "../../../api/cloudFunctionApi";
const appData = getApp().globalData;

Page({
  data: {
    userAvatar: "",
    userName: "",
    changeTheAvatar: false,
  },

  onLoad() {
    const { userAvatar, userName } = appData.user;
    this.setData({
      userAvatar,
      userName,
    });
  },

  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;

    this.setData({
      userAvatar: avatarUrl,
      changeTheAvatar: true,
    });
  },
  async save() {
    const { userAvatar, userName, changeTheAvatar } = this.data;
    const {
      userAvatar: oldUserAvatar,
      userAvatarDefault,
      userNameDefault,
    } = appData.user;

    if (userAvatar === userAvatarDefault) {
      return wx.showToast({
        title: "请设置头像",
        icon: "error",
      });
    } else if (
      userName === userNameDefault ||
      !userName.replace(/^\s+|\s+$/g, "")
    ) {
      return wx.showToast({
        title: "请设置昵称",
        icon: "error",
      });
    }

    let res = { data: null };
    if (changeTheAvatar) {
      res = await uploadUserAvatars({
        openid: appData.openid,
        filePath: userAvatar,
        fileID: oldUserAvatar === userAvatarDefault ? "" : oldUserAvatar,
      });
      if (!res.status) {
        return wx.showToast({
          title: "保存失败",
          icon: "error",
        });
      }
    } else {
      res.data = userAvatar;
    }

    wx.showToast({
      title: "保存成功",
      icon: "success",
      duration: 1000,
      mask: true,
    });
    setTimeout(() => {
      appData.user.userAvatar = res.data;
      appData.user.userName = userName;

      wx.setStorageSync("user", {
        userAvatar: res.data,
        userName,
      });
      wx.navigateBack();
    }, 1000);
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
