const cloud = require('wx-server-sdk')
const CryptoJS = require('crypto-js');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

function sha256(s) {
  // 使用 SHA-256 哈希算法将字符串转换为哈希值
  const hash = CryptoJS.SHA256(s);
  return hash.toString(CryptoJS.enc.Hex);
}

function hasDuplicateDigits(x) {
  // 检查数字中是否有重复的数字
  const digits = String(x).split('');
  return digits.length !== new Set(digits).size;
}

exports.main = async (event, context) => {

  try {
    /**
     * 将字符串转化为数字（若字符串唯一，则结果也具有唯一性）
     * 
     * @param {String} s 需要转换的字符串
     * @param {Number} n 返回的结果的数字位数
     */
    async function convertToUniqueDigits(s, n) {
      // 使用哈希算法将字符串转换为数字
      const m = sha256(s);
      // 将哈希值转换为数字，并将结果映射到指定的位数
      let x = parseInt(m, 16) % (10 ** n);
      // 如果结果中有重复的数字，增加一个偏移量
      // while (hasDuplicateDigits(x)) {
      //   x = (x + 1) % (10 ** n);
      // }
      //检查数据库是否存在这个id
      const hasUID = await checkHasUid(x);
      //存在这个id，则重新调用该函数并增加转化结果的位数
      if (hasUID > 0) {
        return convertToUniqueDigits(s, n + 1); //发现不能使用++，会无限循环
      }
      //不存在这个ID，直接返回结果
      else {
        return x;
      }
    }


    async function checkHasUid(uid) {
      const res = await db.collection('LicensePlateNumber').where({
        uniqueLicensePlateId: uid
      }).count();

      return res.total
    }

    if (!event.openid) return {
      success: false,
      data: 'openid为空'
    }

    const value = await db.collection('LicensePlateNumber').where({
      _openid: event.openid
    }).get()

    if (value.data.length) {
      return {
        success: true,
        data: value.data[0].uniqueLicensePlateId
      }

    } else {

      const uniqueLicensePlateId = await convertToUniqueDigits(event.openid, 4)
      await db.collection('LicensePlateNumber').add({
        data: {
          uniqueLicensePlateId,
          _openid: event.openid
        }
      })

      return {
        success: true,
        data: uniqueLicensePlateId
      }
    }
  } catch (error) {
    return {
      success: false,
      data: error
    }
  }


}