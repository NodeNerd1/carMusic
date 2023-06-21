const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const totalQuantity = await db.collection('CollectionRecord').where({
      _openid: event.openid,
    }).count()
    if (totalQuantity.total == 4) {
      return {
        status: false,
        data: '只能创建三条收藏'
      }
    }

    const count = await db.collection('CollectionRecord').where({
      _openid: event.openid,
      name: event.name
    }).count()

    if (!count.total) {
      await db.collection('CollectionRecord').add({
        data: {
          name: event.name,
          songList: [],
          _openid: event.openid
        }
      })

      return {
        status: true,
        data: '创建成功'
      }

    } else {
      return {
        status: false,
        data: '收藏名重复'
      }
    }
  } catch (e) {
    return {
      status: false,
      data: e
    }
  }
};