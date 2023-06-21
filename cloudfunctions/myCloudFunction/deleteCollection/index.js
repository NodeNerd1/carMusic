const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    await db.collection('CollectionRecord').doc(event.id).remove()
    return {
      status: true,
      data: '删除成功'
    }
  } catch (e) {
    return {
      status: false,
      data: '删除失败'
    }
  }
}