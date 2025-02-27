// components/schedule-week/schedule-week.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    list: {
        type: Array,
        value: []
    },
    locationList: {
        type: Array,
        value: []
    },
    xAxisData: {
        type: Array,
        value: []
    },
    loading: {
        type: Boolean,
        value: false
    },
    locationColor: {
        type: Object,
        value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
      xAxisLineHeight: 0,
      xAxisLineTop: 0
  },

  observers: {
    // 监听 schedule 的变化，更新表单字段
    'list': function (newList) {
      if (newList && Object.keys(newList).length > 0) {
          const _xAxisLineHeight = newList.length * 100
        this.setData({
            xAxisLineHeight: `${_xAxisLineHeight}rpx`,
            xAxisLineTop: `-${_xAxisLineHeight + 10}rpx`
        });
      }
    }
  }, 

  /**
   * 组件的方法列表
   */
  methods: {
    onViewDetail (e) {
        const { item } = e.currentTarget.dataset;
        const { courseName, location, startTime, endTime } = item
        wx.showModal({
            title: courseName,
            showCancel: false,
            confirmText: '知道了',
            content: `${location} ${startTime}~${endTime}`
        });
    }
  }
})