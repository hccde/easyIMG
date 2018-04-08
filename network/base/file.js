const CUSTOMCODE = require('./CUSTOMCODE');
const extend = require('../../libs/extend');
import token from './token'
import server from '../../conf/server'




export default (options) => {
  let {params, url} = options;
  let pubParams = {
    "authorization": token.get(),
    "Content-Type": "multipart/form-data",

  };
  const header = extend(true, {}, pubParams, params.headers);
  console.log('url',url);
  console.log('filePath',params.filePath);
  console.log('header',header);

  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      url: server + url,
      filePath: params.filePath,
      name: params.name,
      header:header,
      success:function(res){
        console.log('resp',res)
        let data = JSON.parse(res.data);

        if(data.respCode === 0) {
          resolve(data.content);
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
      }
    })

  })
}