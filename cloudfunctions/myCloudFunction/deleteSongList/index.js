const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {

  try {
    const data = await db.collection('CollectionRecord').doc(event.id).get()

    const originalLength = data.data.songList.length
    const newValue = data.data.songList.reduce((accumulator, value, index) => {
      const flag = event.songList.some((e) => e.songMid === value.songMid);
      if (flag) return accumulator;

      accumulator.push(value);
      return accumulator;
    }, []);

    if (originalLength === newValue.length) {
      return {
        status: false,
        data: '删除失败'
      }
    }
    await db.collection('CollectionRecord').doc(event.id).update({
      data: {
        songList: newValue
      }
    })
    return {
      status: true,
      data: newValue
    }
  } catch (error) {
    return {
      status: false,
      data: error
    }
  }
}