const appData = getApp().globalData;

Component({
  data: {
    selected: 0,
    list: [
      {
        text: "正在播放",
        pagePath: "/pages/play/play",
        iconPath: "/static/images/播放_icon.png",
        selectedIconPath: "/static/images/播放.png",
      },
      {
        text: "车位",
        pagePath: "/pages/carport/carport",
        iconPath: "/static/images/汽车_icon.png",
        selectedIconPath: "/static/images/汽车.png",
      },

      {
        text: "排行榜",
        pagePath: "/pages/ranking/ranking",
        iconPath: "/static/images/排行_icon.png",
        selectedIconPath: "/static/images/排行.png",
      },
      {
        text: "歌手",
        pagePath: "/pages/singer/singer",
        iconPath: "/static/images/singer_icon.png",
        selectedIconPath: "/static/images/singer.png",
      },
      {
        text: "我的",
        pagePath: "/pages/my/my",
        iconPath: "/static/images/我的_icon.png",
        selectedIconPath: "/static/images/我的.png",
      },
    ],
    ishideTabBar: false,
  },
  attached() {
    this.setData({
      ishideTabBar: appData.ishideTabBar,
    });
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url,
      });
      this.setData({
        selected: data.index,
      });
    },
  },
});
