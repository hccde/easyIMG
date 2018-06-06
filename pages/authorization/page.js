// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime');
import wxapi from '../../libs/wx-api-promise/index';
import { account } from '../../network/index';
import wxUserinfoManager from '../../global/wxUserinfo';

Page({
  data:{
    sessionKey:''
  },
  onLoad: async function (opt) {
      this.data.sessionKey = opt.sessionKey;
  },
  async getUserInfo(e){
    const opt = e.detail;
    console.log(e,55)
    if(!opt.userInfo){
      return;
    }
    const res = await account.addCustomerInfo({
      sessionKey:this.data.sessionKey,
      iv:opt.iv,
      encryptedData:opt.encryptedData,
      userinfo:opt.userInfo
    });
    console.log(res);
  
    wxUserinfoManager.set(opt.userinfo);
  }
})
