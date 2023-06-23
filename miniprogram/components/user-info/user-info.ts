import {} from "../../api/cloudFunctionApi";
const appData = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    userAvatar: "",
    userName: "",
  },
  pageLifetimes: {
    show: function () {
      const { userAvatar, userName } = appData.user;
      this.setData({ userAvatar, userName });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent() {
      wx.navigateTo({
        url: "/components/user-info/user-info-fillout/user-info-fillout",
      });
    },
  },
});
