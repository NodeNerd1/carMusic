const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const data = await db.collection('CollectionRecord').where({
      _openid: event.openid,
      name: event.name || '默认收藏'
    }).get();
    return {
      status: true,
      data: data.data[0].songList
    }
  } catch (error) {
    return {
      status: false,
      data: error
    }
  }
};