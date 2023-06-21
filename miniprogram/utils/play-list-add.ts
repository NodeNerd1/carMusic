import { songAvatarUrl } from "../api/songApi";
function filterList(list) {
  return (list || []).map((e) => {
    return {
      songName: e.name,
      songImage: songAvatarUrl(e.album.mid),
      songMid: e.mid,
      singer: filterSingerName(e.singer),
      albumName: e.album.name,
      interval: e.interval,
    };
  });
}
function filterSingerName(list) {
  if (typeof list === "string") return list;
  let name = "";
  list.forEach((item, index: number) => {
    let value = index == 0 ? item.name : "/" + item.name;
    name += value;
  });
  return name;
}

function playListAdd(list) {
  let value = wx.getStorageSync("playList");
  if (value) {
    value.unshift(...list);
    const newValue = value.reduce((accumulator, value, index) => {
      if (index !== 0) {
        const flag = accumulator.some((e) => e.songMid === value.songMid);
        if (flag) {
          return accumulator;
        }
      }
      accumulator.push(value);
      return accumulator;
    }, []);
    newValue.splice(200);
    wx.setStorageSync("playList", newValue);
  } else {
    wx.setStorageSync("playList", list);
  }
}

function playNextAdd(list, currentPlayIndex: number) {
  let value = wx.getStorageSync("playList");
  if (value) {
    let index = 0;
    if (currentPlayIndex !== 199) {
      index = currentPlayIndex + 1;
    }
    value.splice(index, 0, ...list);

    const newValue = value.reduce((accumulator, value, index) => {
      if (value.songMid !== list[0].songMid) {
        accumulator.push(value);
        return accumulator;
      } else {
        if (currentPlayIndex !== 199) {
          if (
            index > currentPlayIndex &&
            !accumulator.some((e) => e.songMid == value.songMid)
          ) {
            accumulator.push(value);
          }
          return accumulator;
        } else {
          if (index == 0) {
            accumulator.push(value);
          }
          return accumulator;
        }
      }
    }, []);

    newValue.splice(200);
    wx.setStorageSync("playList", newValue);
  } else {
    wx.setStorageSync("playList", list);
  }
}

function iLikeMusicAdd(list) {
  let value = wx.getStorageSync("iLikeMusicList");

  if (value) {
    if (list.length == 1) {
      const flag = value.some((e) => e.songMid === list[0].songMid);
      if (flag) {
        wx.showToast({ title: "添加重复", icon: "error" });
        return;
      }
    }
    value.unshift(...list);
    const newValue = value.reduce((accumulator, value, index) => {
      if (index !== 0) {
        const flag = accumulator.some((e) => e.songMid === value.songMid);
        if (flag) {
          return accumulator;
        }
      }
      accumulator.push(value);
      return accumulator;
    }, []);
    newValue.splice(200);
    wx.setStorageSync("iLikeMusicList", newValue);
  } else {
    wx.setStorageSync("iLikeMusicList", list);
  }
  wx.showToast({ title: "添加成功", icon: "success" });
}

function iLikeMusicDelete(index: number) {
  let value = wx.getStorageSync("iLikeMusicList");
  value.splice(index, 1);
  wx.setStorageSync("iLikeMusicList", value);
  return { singerSongList: value, backgroundImage: value[0]?.songImage };
}

export {
  playListAdd,
  playNextAdd,
  iLikeMusicAdd,
  iLikeMusicDelete,
  filterList,
};
