const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
exports.main = async (event, context) => {
  try {
    if (event.songList.length == 1) {
      const data = event._openid ? await db.collection('CollectionRecord').where({
        _openid: event._openid,
        name: '默认收藏'
      }).get() : await db.collection('CollectionRecord').doc(event.id).get();

      let oneListValue = null
      event._openid ? oneListValue = data.data[0] : oneListValue = data.data

      const flag = oneListValue.songList.some(e => e.songMid === event.songList[0].songMid)

      if (flag) {
        return {
          status: false,
          data: '添加重复'
        }
      }

      oneListValue.songList.unshift(...event.songList)
      oneListValue.songList.splice(200);
      const value = await (event._openid ? db.collection('CollectionRecord').where({
        _openid: event._openid,
        name: '默认收藏'
      }) : db.collection('CollectionRecord').doc(event.id)).update({
        data: {
          songList: oneListValue.songList
        }
      })

      if (value.stats.updated) {
        return {
          status: true,
          data: '添加成功'
        }
      } else {
        return {
          status: false,
          data: '添加失败'
        }
      }


    }



    const data = event._openid ? await db.collection('CollectionRecord').where({
      _openid: event._openid,
      name: '默认收藏'
    }).get() : await db.collection('CollectionRecord').doc(event.id).get()

    let multipleListValue = null
    event._openid ? multipleListValue = data.data[0] : multipleListValue = data.data

    multipleListValue.songList.unshift(...event.songList);

    const newValue = multipleListValue.songList.reduce((accumulator, value, index) => {
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
    const res = await (event._openid ? db.collection('CollectionRecord').where({
      _openid: event._openid,
      name: '默认收藏'
    }) : db.collection('CollectionRecord').doc(event.id)).update({
      data: {
        songList: newValue
      }
    })

    if (res.stats.updated) {
      return {
        status: true,
        data: '添加成功'
      }

    } else {
      return {
        status: false,
        data: '添加失败'
      }
    }
  } catch (error) {
    return {
      status: false,
      data: error
    }
  }

};