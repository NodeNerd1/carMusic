const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
  try {
    const {
      licensePlateNumber
    } = event

    const count = await db.collection('OnlineForm').where({
      licensePlateNumber
    }).get()

    if (count.data.length == 1) {
      const Parameter = {
        playRepeat: "",
        playShuffle: "",
        playRepeatOne: "",
        skipBack: "",
        play: "",
        paused: "",
        skipForward: "",
        playthis: null,
        playNext: null
      }
      for (const key in Parameter) {
        if (Object.hasOwnProperty.call(Parameter, key)) {
          event[key] ? Parameter[key] = event[key] : delete Parameter[key]
        }
      }

      await db.collection('OnlineForm').where({
        licensePlateNumber
      }).update({
        data: Parameter
      })
      return {
        success: true,
        data: '操作成功'
      }

    } else {
      return {
        success: false,
        data: '操作失败'
      }
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }

}