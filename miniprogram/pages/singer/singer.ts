import { getSingerList, singerAvatarUrl, ListType } from "../../api/singerApi";
const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

type itemsType = {
  avatar: string;
  mid: string;
  name: string;
}[];
type singerListType = {
  title: string;
  items: itemsType;
}[];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    singerList: <singerListType>[
      {
        items: [
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000002J4UUk29y8BY.jpg?max_age=2592000",
            mid: "002J4UUk29y8BY",
            name: "薛之谦",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000",
            mid: "0025NhlN2yWrP4",
            name: "周杰伦",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000004AlfUb0cVkN1.jpg?max_age=2592000",
            mid: "004AlfUb0cVkN1",
            name: "BIGBANG (빅뱅)",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000003Nz2So3XXYek.jpg?max_age=2592000",
            mid: "003Nz2So3XXYek",
            name: "陈奕迅",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000001BLpXF2DyJe2.jpg?max_age=2592000",
            mid: "001BLpXF2DyJe2",
            name: "林俊杰",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M0000020PeOh4ZaCw1.jpg?max_age=2592000",
            mid: "0020PeOh4ZaCw1",
            name: "Alan Walker (艾伦·沃克)",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000000aHmbL2aPXWH.jpg?max_age=2592000",
            mid: "000aHmbL2aPXWH",
            name: "李荣浩",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000000zmpju02bEBm.jpg?max_age=2592000",
            mid: "000zmpju02bEBm",
            name: "TFBOYS",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000001JuGrt372YIQ.jpg?max_age=2592000",
            mid: "001JuGrt372YIQ",
            name: "Maroon 5 (魔力红乐团)",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000000CK5xN3yZDJt.jpg?max_age=2592000",
            mid: "000CK5xN3yZDJt",
            name: "许嵩",
          },
        ],
        title: "热门",
      },
      {
        items: [
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000002J4UUk29y8BY.jpg?max_age=2592000",
            mid: "002J4UUk29y8BY",
            name: "薛之谦",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000",
            mid: "0025NhlN2yWrP4",
            name: "周杰伦",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000004AlfUb0cVkN1.jpg?max_age=2592000",
            mid: "004AlfUb0cVkN1",
            name: "BIGBANG (빅뱅)",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000003Nz2So3XXYek.jpg?max_age=2592000",
            mid: "003Nz2So3XXYek",
            name: "陈奕迅",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000001BLpXF2DyJe2.jpg?max_age=2592000",
            mid: "001BLpXF2DyJe2",
            name: "林俊杰",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M0000020PeOh4ZaCw1.jpg?max_age=2592000",
            mid: "0020PeOh4ZaCw1",
            name: "Alan Walker (艾伦·沃克)",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000000aHmbL2aPXWH.jpg?max_age=2592000",
            mid: "000aHmbL2aPXWH",
            name: "李荣浩",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000000zmpju02bEBm.jpg?max_age=2592000",
            mid: "000zmpju02bEBm",
            name: "TFBOYS",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000001JuGrt372YIQ.jpg?max_age=2592000",
            mid: "001JuGrt372YIQ",
            name: "Maroon 5 (魔力红乐团)",
          },
          {
            avatar:
              "https://y.gtimg.cn/music/photo_new/T001R300x300M000000CK5xN3yZDJt.jpg?max_age=2592000",
            mid: "000CK5xN3yZDJt",
            name: "许嵩",
          },
        ],
        title: "热门",
      },
    ],
    currentIndex: 0,
    jumpIndex: 0,
    listHeight: <number[]>[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(option) {
    const res = await getSingerList();
    this.setData({
      singerList: this.filterSingerList(res.data?.data.list || []),
    });
    this.getHeight();
  },

  filterSingerList(list: ListType): singerListType {
    let map: Record<string, any> = {
      hot: {
        title: HOT_NAME,
        items: [],
      },
    };
    list.forEach((item, index) => {
      if (index < HOT_SINGER_LEN) {
        (map.hot.items as itemsType).push({
          mid: item.Fsinger_mid,
          name: item.Fsinger_name,
          avatar: singerAvatarUrl(item.Fsinger_mid),
        });
      }
      const key = item.Findex;
      if (!map[key]) {
        map[key] = {
          title: key,
          items: [],
        };
      }
      map[key].items.push({
        mid: item.Fsinger_mid,
        name: item.Fsinger_name,
        avatar: singerAvatarUrl(item.Fsinger_mid),
      });
    });
    let hot = [];
    let ret = [];
    for (let key in map) {
      var val = map[key];
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val);
      } else if (val.title === HOT_NAME) {
        hot.push(val);
      }
    }
    // 按a-z排序
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0);
    });
    return hot.concat(ret);
  },

  singerListTap(event: WechatMiniprogram.BaseEvent) {
    this.setData({
      currentIndex: event.target.dataset.index,
      jumpIndex: event.target.dataset.index,
    });
  },
  scroll(event: WechatMiniprogram.ScrollViewScroll) {
    const newY = event.detail.scrollTop;
    const listHeight = this.data.listHeight;
    // 滚动到顶部
    if (newY < 0) {
      this.setData({
        currentIndex: 0,
      });
      return;
    }

    // 滚到中间部分
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i];
      let height2 = listHeight[i + 1];
      if (newY >= height1 && newY < height2) {
        this.setData({ currentIndex: i });
        return;
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setData({
      currentIndex: listHeight.length - 2,
    });
  },
  getHeight() {
    wx.createSelectorQuery()
      .in(this)
      .selectAll(".list-group")
      .fields({ size: true })
      .exec((e) => {
        let listHeight = [];
        let height = 0;
        listHeight.push(height);
        e[0].forEach((item: { width: number; height: number }) => {
          height += item.height;
          listHeight.push(height);
        });
        this.setData({
          listHeight: listHeight,
        });
      });
  },

  toSingerDetail(event: WechatMiniprogram.BaseEvent) {
    wx.navigateTo({
      url: "/pages/detail-list/detail-list",
      success: function (res) {
        res.eventChannel.emit(
          "getSingerItem",
          event.currentTarget.dataset.singer
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
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
      });
    }
  },

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
