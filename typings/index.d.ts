/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}

type DataType = {
  status: boolean;
  data?: Record<string, any> | string | ArrayBuffer;
  allData: any;
};
