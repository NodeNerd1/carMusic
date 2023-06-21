const getOpenId = require('./getOpenId/index');
// const getMiniProgramCode = require('./getMiniProgramCode/index');
const getSongLyric = require('./getSongLyric/index');
//
const generateNumber = require('./generateNumber/index');
//
const createFavoriteDefault = require('./createFavoriteDefault/index');
const createCollection = require('./createCollection/index');
const deleteCollection = require('./deleteCollection/index');
const queryCollection = require('./queryCollection/index');
const querySingleCollection = require('./querySingleCollection/index');

//
const addSongList = require('./addSongList/index');
const deleteSongList = require('./deleteSongList/index');

//
const linkOnlineForm = require('./linkOnlineForm/index');
const componentFn = require('./componentFn/index');



// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
      // case 'getMiniProgramCode':
      //   return await getMiniProgramCode.main(event, context);
    case 'createCollection':
      return await createCollection.main(event, context);
    case 'getSongLyric':
      return await getSongLyric.main(event, context);
    case 'createFavoriteDefault':
      return await createFavoriteDefault.main(event, context);
    case 'queryCollection':
      return await queryCollection.main(event, context);
    case 'deleteCollection':
      return await deleteCollection.main(event, context);
    case 'addSongList':
      return await addSongList.main(event, context);
    case 'deleteSongList':
      return await deleteSongList.main(event, context);
    case 'generateNumber':
      return await generateNumber.main(event, context);
    case 'linkOnlineForm':
      return await linkOnlineForm.main(event, context);
    case 'componentFn':
      return await componentFn.main(event, context);
    case 'querySingleCollection':
      return await querySingleCollection.main(event, context);
  }
};