const { $post } = require('./utils/request.js');

App({
  onLaunch() {
    // 版本更新检测
    this.checkUpdate();

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
  },
  
  checkUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      // 监听是否有新版本
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          // 有新版本时提示用户
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否立即更新？',
            success: (res) => {
              if (res.confirm) {
                // 用户确认更新
                this.doUpdate(updateManager);
              }
            }
          });
        }
      });
    } else {
      // 如果用户版本过低，提示升级微信
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用更新功能，请升级到最新微信版本后重试。'
      });
    }
  },

  doUpdate: function(updateManager) {
    // 显示下载进度
    wx.showLoading({
      title: '更新中...',
      mask: true
    });

    // 监听下载进度
    updateManager.onUpdateReady(() => {
      wx.hideLoading();
      // 强制更新
      updateManager.applyUpdate();
    });

    // 监听下载失败
    updateManager.onUpdateFailed(() => {
      wx.hideLoading();
      wx.showModal({
        title: '更新失败',
        content: '新版本下载失败，请检查网络后重试',
        showCancel: false
      });
    });
  }
  
})
