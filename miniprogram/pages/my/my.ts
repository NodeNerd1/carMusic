// pages/my/my.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      { title: "我喜欢的音乐", path: "/pages/detail-list/detail-list" },
      { title: "我的收藏", path: "/pages/my-collection/my-collection" },
      { title: "我的设置", path: "/pages/my-settings/my-settings" },
    ],
  },

  goView(event: WechatMiniprogram.BaseEvent) {
    const { url, index, title } = event.currentTarget.dataset;

    if (index === 0) {
      const value = wx.getStorageSync("iLikeMusicList") || [];

      wx.navigateTo({
        url,
        success: (res) => {
          res.eventChannel.emit("getSingerItem", {
            name: title,
            avatar: value[0]?.songImage,
            data: {
              data: value,
            },
            love: true,
          });
        },
      });
    } else {
      wx.navigateTo({ url });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

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
