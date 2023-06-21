import {
  getOpenId,
  createFavoriteDefault,
  queryCollection,
  generateNumber,
} from "./api/cloudFunctionApi";

App({
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "cloud1-5gp0vsntf323d373",
        traceUser: true,
      });
    }
    const user = wx.getStorageSync("user");
    if (user) {
      this.globalData.user.userName = user.userName;
      this.globalData.user.userAvatar = user.userAvatar;
    }
    const Cookie = wx.getStorageSync("Cookie");
    if (Cookie) {
      this.globalData.Cookie = Cookie;
    }
    const openid = await getOpenId();
    this.globalData.openid = openid;

    const uniqueLicensePlateId = await generateNumber(openid);
    if (uniqueLicensePlateId.success) {
      this.globalData.uniqueLicensePlateId = uniqueLicensePlateId.data;
    }

    await createFavoriteDefault(openid);

    const res = await queryCollection(openid);

    this.globalData.collectionList = res;
    const currentPages = getCurrentPages();

    if (typeof currentPages[0].updateLicensePlate === "function") {
      currentPages[0].updateLicensePlate();
    }
  },
  globalData: {
    openid: "",
    collectionList: [],
    Cookie: "",
    uniqueLicensePlateId: 0,
    ownerOpenId: "",
    ownerName: 0,
    user: {
      userAvatar:
        "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
      userName: "用户名称",
      userAvatarDefault:
        "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
      userNameDefault: "用户名称",
    },
  },
});
