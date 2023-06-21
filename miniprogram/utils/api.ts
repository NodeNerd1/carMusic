function request({
  url,
  data,
  method,
  header,
  timeout,
}: WechatMiniprogram.RequestOption) {
  return new Promise<DataType>((resolve) => {
    wx.request({
      url,
      method,
      timeout,
      header,
      data,
      dataType: "json",
      success: (res) => {
        if (/^[4|5]/.test(res.statusCode + "")) {
          resolve({
            status: false,
            allData: res,
          });
        } else {
          resolve({
            status: true,
            data: res.data || undefined,
            allData: res,
          });
        }
      },
      fail: (error) => {
        resolve({
          status: false,
          allData: error,
        });
      },
    });
  });
}

function get({ url, data, header ,timeout = 6000 }: WechatMiniprogram.RequestOption) {
  return request({
    url,
    data,
    timeout,
    header,
    method: "GET",
  });
}
function post({ url, data, header ,timeout = 6000 }: WechatMiniprogram.RequestOption) {
  return request({
    url,
    data,
    timeout,
    header,
    method: "POST",
  });
}

export { request, get, post };
