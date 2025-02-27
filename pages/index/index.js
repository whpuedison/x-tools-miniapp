// 页面或组件的 JS
Page({
    data: {
    },
  
    // 进入排课页面
    enterSchedulePage() {
      wx.navigateTo({
        url: '/pages/schedule/schedule',
      });
    }
  });
  