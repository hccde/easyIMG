// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime')
import { init, account } from '../../network/index'
import wxapi from '../../libs/wx-api-promise/index'
import wxUserinfoManager from '../../global/wxUserinfo'
import tokenManager from '../../global/token'
import openIDManager from '../../global/openID'
import gifjs from '../../libs/gifjs/index.js'
let  Base64 = require('../../libs/base64.js').Base64
const isProfileComplete = (userinfo) => userinfo && userinfo.avatarUrl && userinfo.gender && userinfo.nickName


function encode64(input) {
	var output = "", i = 0, l = input.length,
	key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
	chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	while (i < l) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) enc3 = enc4 = 64;
		else if (isNaN(chr3)) enc4 = 64;
		output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
	}
	return output;
}

Page({
  ctx:null,
  gif:1,
  data:{

  },
  onShow:function(){
    let gif = new gifjs(320, 240);
    gif.start();
    gif.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    gif.setDelay(500);  // frame delay in ms
    gif.setQuality(10); // image quality. 10 is default.
    this.gif = gif;
    this.canvasInit();
    
    // encoder.addFrame(ctx);

    // gifjs.
  },
    canvasInit:function(){
      if(!this.ctx){
        let context = wx.createCanvasContext('canvas', this);
        this.ctx = context
      }
      this.ctx.drawImage('https://www.baidu.com/img/bd_logo1.png?where=super', 0, 0),300,300;
        let that = this;
        this.ctx.draw(false, function(){ //wx bug attetion
          wx.canvasGetImageData({
            x: 0,
            y: 0,
            width:300,
            height:300,
            canvasId: 'canvas',
            success:function(res){
              that.gif.addFrame(res);
              that.gif.finish();
              let out = 'data:image/gif;base64,'+encode64(that.gif.stream().getData());
              console.log(that.gif.stream().getData(),44)

              // let t = Base64.encode(out.pages);
              console.log(out,33)
              // console.log(Base64.decode(t))
            },
            fail:function(err){
              console.log(err)
            }
          },that);
        });
  },
  onLoad: async function () {
    // 校验本地token
    let token = tokenManager.get('token')
    let userinfo = wxUserinfoManager.get()
    // 未登录 或 未授权
    if (!userinfo || token) {
      // 获取微信code
      const wxLoginRes = await wxapi.login()
      console.log('wxLoginRes:', wxLoginRes)
      if (!wxLoginRes.success) {
        // todo
        return
      }

      // 用code登录
      const loginRes = await account.login({
        code: wxLoginRes.res.code
      })
      console.log('loginRes:', loginRes)

      if (loginRes.respCode !== 0) {
        // todo
        return
      }
      token = loginRes.content.jwtToken
      tokenManager.set(token)
      if (!loginRes.content.userinfo || !loginRes.content.userinfo.nickname) {
        // 该微信用户之前未绑定opneid-userid
        wx.navigateTo({
          url: `/pages/authorization/page?sessionKey=${loginRes.content['sessionKey']}`
        });
      } else {
        // 登录成功, 该微信用户之前已绑定openid-userid
        wxUserinfoManager.set(loginRes.content.userinfo)
        console.log(tokenManager.get(token), 66)
        // 登录成功
        userinfo = loginRes.content
        // 个人信息不完整
      }
      return
    }
  }
})
