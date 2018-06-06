// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime')

import { init, account } from '../../network/index'
import wxapi from '../../libs/wx-api-promise/index'
import wxUserinfoManager from '../../global/wxUserinfo'
import tokenManager from '../../global/token'
import openIDManager from '../../global/openID'

const isProfileComplete = (userinfo) => userinfo && userinfo.avatarUrl && userinfo.gender && userinfo.nickName


Page({
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
