function getOpenId() {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "getOpenId",
      },
    })
    .then((res) => {
      return res.result.openid;
    });
}

function createFavoriteDefault(openid: string) {
  return wx.cloud.callFunction({
    name: "myCloudFunction",
    data: {
      type: "createFavoriteDefault",
      openid: openid,
    },
  });
}

function queryCollection(openid: string) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "queryCollection",
        openid,
      },
    })
    .then((res) => {
      return res.result;
    });
}

function createCollection({ openid, name }) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "createCollection",
        openid,
        name,
      },
    })
    .then((res) => {
      return res.result;
    });
}

function deleteCollection(id: string) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "deleteCollection",
        id,
      },
    })
    .then((res) => {
      return res.result;
    });
}

function addSongList({ id = "", songList, _openid = "" }) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "addSongList",
        id,
        songList,
        _openid,
      },
    })
    .then((res) => {
      return res.result;
    });
}

async function uploadUserAvatars({ openid, filePath, fileID }) {
  try {
    if (fileID) {
      await wx.cloud.deleteFile({ fileList: [fileID] });
      // const deleteList = await wx.cloud.deleteFile({ fileList: [fileID] });
      // if (deleteList.fileList[0].status !== 0) {
      //   return {
      //     status: false,
      //     data: deleteList.fileList[0].errMsg,
      //   };
      // }
    }

    const res = await wx.cloud.uploadFile({
      cloudPath: `${openid}-${Date.now()}.png`,
      filePath,
    });

    const value = await wx.cloud.getTempFileURL({
      fileList: [res.fileID],
    });

    return {
      status: true,
      data: value.fileList[0].tempFileURL,
    };
  } catch (error) {
    return {
      status: false,
      data: error.errMsg,
    };
  }
}

function deleteSongList({ id, songList }) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "deleteSongList",
        id,
        songList,
      },
    })
    .then((res) => {
      return res.result;
    });
}

function generateNumber(openid: string) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "generateNumber",
        openid,
      },
    })
    .then((res) => {
      return res.result;
    });
}

function linkOnlineForm({
  becomeOwner = undefined,
  becomeMember = undefined,
  openid,
  licensePlateNumber,
  name,
  avatar,
}) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "linkOnlineForm",
        becomeOwner,
        becomeMember,
        openid,
        licensePlateNumber,
        name,
        avatar,
      },
    })
    .then((res) => {
      return res.result;
    });
}

function componentFn({
  licensePlateNumber,
  playRepeat = undefined,
  playShuffle = undefined,
  playRepeatOne = undefined,
  skipBack = undefined,
  play = undefined,
  paused = undefined,
  skipForward = undefined,
  playthis = undefined,
  playNext = undefined
}) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "componentFn",
        licensePlateNumber,
        playRepeat,
        playShuffle,
        playRepeatOne,
        skipBack,
        play,
        paused,
        skipForward,
        playthis,
        playNext
      },
    })
    .then((res) => {
      return res.result;
    });
}

function querySingleCollection(openid: string) {
  return wx.cloud
    .callFunction({
      name: "myCloudFunction",
      data: {
        type: "querySingleCollection",
        openid,
      },
    })
    .then((res) => {
      return res.result;
    });
}

export {
  getOpenId,
  createFavoriteDefault,
  queryCollection,
  createCollection,
  deleteCollection,
  addSongList,
  uploadUserAvatars,
  deleteSongList,
  generateNumber,
  linkOnlineForm,
  componentFn,
  querySingleCollection,
};
