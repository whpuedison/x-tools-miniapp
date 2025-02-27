const { $post } = require('./utils/request.js');

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
          console.log('res', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const { code } = res
        if (code) {
            // 向后台发送请求，传递登录 code 获取 openid
            $post('/miniapp/auth/getUserInfo', { code })
            .then(data => {
                const { openid } = data
                wx.setStorageSync('openid', openid)
            })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
