import { slider, getRecommendList } from "../../api/recommendApi";
type topListType = {
  id: number;
  listenCount: number;
  picUrl: string;
  songList: { singername: string; songname: string }[];
  topTitle: string;
  type: number;
}[];

Page({
  data: {
    slider: slider,
    recommendList: <topListType>[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    const res = await getRecommendList();
    this.setData({
      recommendList: res.data?.data.topList || [],
    });
  },

  toSearch() {
    wx.navigateTo({
      url: "/pages/search/search",
    });
  },

  viewDetails(event: WechatMiniprogram.BaseEvent){
    const { topTitle, picUrl ,id} = event.currentTarget.dataset.item;

    wx.navigateTo({
      url: "/pages/detail-list/detail-list",
      success: function (res) {
        res.eventChannel.emit(
          "getSingerItem",
          {
            name:topTitle,
            avatar: picUrl,
            topId: id
          }
        );
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
