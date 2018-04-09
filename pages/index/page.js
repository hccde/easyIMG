// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime')

import {init, account} from '../../network/index'
import wxapi from '../../libs/wx-api-promise/index'
import wxUserinfoManager from '../../global/wxUserinfo'
import tokenManager from '../../global/token'
import openIDManager from '../../global/openID'
import roleManager from '../../global/role'

const isProfileComplete = (userinfo) => userinfo && userinfo.avatarUrl && userinfo.gender && userinfo.nickName

const getWXUserInfo =  () => new Promise(async (resolve) => {
  const wxUserinfoRes = await wxapi.getUserInfo()
  console.log('wxUserinfoRes:', wxUserinfoRes)
  const wxUserinfo = wxUserinfoRes.success ? wxUserinfoRes.res.userInfo : null
  wxUserinfoManager.set(wxUserinfo)
  resolve(wxUserinfo)
})

const gotoCellphone = () => new Promise(async (resolve) => {
  wx.redirectTo({
    url: '/pages/passport/cellphone/page'
  })
  resolve()
})

const gotoSupplyProfile = () => new Promise(async (resolve)=> {
  await getWXUserInfo()
  wx.redirectTo({
    url: '/pages/other/supply-profile/page'
  })
  resolve()
})

const gotoHome = () => new Promise(async (resolve) => {
  const role = roleManager.get()
  wx.redirectTo({
    url: `/pages/${role}/index/page`
  })
  resolve()
})

Page({
  onLoad: async function () {
    // 校验本地token
    let token = tokenManager.get()
    // init(token)

    let userinfo;
    if (token) {
      const userinfoRes = await account.getCustomerInfo()
      if (userinfoRes.respCode === 0) {
        // 个人信息已经完善
        userinfo = userinfoRes.content
      }
    }

    // 未登录
    if (!userinfo) {
      return;
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
      if (token) {
        // 登录成功, 该微信用户之前已绑定openid-userid
        tokenManager.set(token)
        // 登录成功
        userinfo = loginRes.content
        // 个人信息不完整
        if (isProfileComplete(userinfo)) {
          await gotoHome()
        } else {
          await gotoSupplyProfile()
        }
      } else {
        // 该微信用户之前未绑定opneid-userid
        const openID = loginRes.content.openId
        openIDManager.set(openID)

        await getWXUserInfo()
        await gotoCellphone()
      }
      return
    }

    // 个人信息不完整
    if (isProfileComplete(userinfo)) {
      await gotoHome()
    } else {
      await gotoSupplyProfile()
    }
  }
})
