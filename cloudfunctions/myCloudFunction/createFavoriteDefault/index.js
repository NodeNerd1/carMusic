const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const count = await db.collection('CollectionRecord').where({
      _openid: event.openid,
      name: '默认收藏'
    }).count()

    if (!count.total) {
      await db.collection('CollectionRecord').add({
        data: {
          name: '默认收藏',
          songList: [],
          _openid: event.openid
        }
      })
    }
    return {
      success: true,
      data: '创建成功'
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }
}