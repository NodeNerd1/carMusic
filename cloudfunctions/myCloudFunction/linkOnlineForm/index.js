const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
  try {
    const {
      becomeOwner,
      becomeMember,
      openid,
      licensePlateNumber,
      name,
      avatar
    } = event

    if (typeof becomeOwner == 'boolean') {
      const count = await db.collection('OnlineForm').where({
        _openid: openid
      }).count()

      if (becomeOwner) {
        if (count.total == 0) {
          await db.collection('OnlineForm').add({
            data: {
              _openid: openid,
              licensePlateNumber,
              Members: [{
                name,
                avatar,
                _openid: openid,
                owner: true
              }]
            }
          })
        }
        return {
          success: true,
          data: '操作成功'
        }
      } else {
        if (count.total == 1) {
          await db.collection('OnlineForm').where({
            _openid: openid
          }).remove()
        }
        return {
          success: true,
          data: '操作成功'
        }

      }

    } else {
      const count = await db.collection('OnlineForm').where({
        licensePlateNumber
      }).get()
      if (becomeMember) {
        if (count.data.length == 1) {
          if (count.data[0].Members.length >= 7) {
            return {
              success: false,
              data: '当前车队已满'
            }
          }

          count.data[0].Members.push({
            name,
            avatar,
            _openid: openid,
            owner: false
          })

          const newValue = count.data[0].Members.reduce((accumulator, value, index) => {
            const flag = accumulator.some((e) => e._openid === value._openid);
            if (flag) return accumulator;

            accumulator.push(value);
            return accumulator;
          }, []);

          await db.collection('OnlineForm').where({
            licensePlateNumber
          }).update({
            data: {
              Members: newValue,
            }
          })
          return {
            success: true,
            data: newValue,
            ownerOpenId: count.data[0]._openid
          }
        } else {
          return {
            success: false,
            data: '当前车队离线'
          }
        }
      } else {
        if (count.data.length == 1) {
          const value = count.data[0].Members
          const index = value.findIndex(e => e._openid === openid)
          value.splice(index, 1)

          await db.collection('OnlineForm').where({
            licensePlateNumber
          }).update({
            data: {
              Members: value,
            }
          })
          return {
            success: true,
            data: '离开成功'
          }

        } else {
          return {
            success: true,
            data: '离开成功'
          }
        }
      }
    }



  } catch (error) {
    return {
      success: false,
      data: error
    }
  }


}