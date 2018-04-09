// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime');

const extend = require('../../libs/extend');
// import server from '../../conf/server'
const server = ''
import createPubParams from './createPubParams'
const CUSTOMCODE = require('./CUSTOMCODE');
import wxapi from '../../libs/wx-api-promise/index'

export default async ({url, method, params, headers}) => {
  // 判断网络状况
  const getNetworkTypeRes = await wxapi.getNetworkType();
  if (getNetworkTypeRes.networkType === 'none') {
    return {
      returnCode: CUSTOMCODE.OFFLINE,
      returnMsg: '网络不通，请联网后重试。'
    };
  }

  // 生成公共参数
  const pubParams = createPubParams();
  const header = extend(true, {}, pubParams, headers);

  const res = await new Promise(function (resolve, reject) {
    wxapi.request({
      url: server + url,
      header: header,
      data: params ? params : {},
      method: method
    }).then(function (res) {
      if (({}).toString.call(res.res.data) === '[object Object]') {
        resolve(res.res.data);
      }
      else {
        resolve({
          respCode: CUSTOMCODE.SERVERERROR,
          respMsg: '服务器错误，请稍后重试。'
        });
      }
    }, function () {
      resolve({
        respCode: CUSTOMCODE.UNKNOWN,
        respMsg: '请求失败，请稍后重试。'
      });
    })
  });
  return res;
};
