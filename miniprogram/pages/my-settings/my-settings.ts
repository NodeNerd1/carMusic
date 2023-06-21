import { antiShaking } from "../../utils/utils";
const appData = getApp().globalData;

Page({
  data: {
    cookieValue: "",
  },

  onLoad() {
    this.setData({
      cookieValue: appData.Cookie,
    });
  },

  save() {
    const Cookie = this.data.cookieValue.replace(/^\s+|\s+$/g, "");

    wx.showToast({
      title: "保存成功",
      icon: "success",
      duration: 1000,
      mask: true,
    });

    setTimeout(() => {
      appData.Cookie = Cookie;
      wx.setStorageSync("Cookie", Cookie);
      wx.navigateBack();
    }, 1000);
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
