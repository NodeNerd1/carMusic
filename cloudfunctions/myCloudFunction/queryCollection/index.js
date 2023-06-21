const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const data = await db.collection('CollectionRecord').where({
      _openid: event.openid,
    }).get();
    return data.data
  } catch (error) {
    return error
  }

};