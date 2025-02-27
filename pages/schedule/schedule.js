const { $get, $post } = require('../../utils/request.js');  // 引入接口调用方法
const { getMinDate, getMaxDate, getCurYearMonthDesc, formatDate, getMondayAndSunday } = require('../../utils/util.js');

const MIN_DATE = getMinDate()
const MAX_DATE = getMaxDate()
const CUSTOM_DATE_SPLIT_KEY = ' 至 '

const SORT_OPTION = [
    { text: '时间顺序', value: 'asc' },
    { text: '时间倒序', value: 'desc' },
]

Page({
  data: {
    loading: false,
    list: [],
    locationColor: {},
    locationList: [],
    courseTypeList: [],
    historyLoading: false,
    historyList: [],
    sortOption: SORT_OPTION,
    sort: 'desc',
    curDate: null,
    curDateDesc: '',
    showCurDatePicker: false,
    maxDate: MAX_DATE,
    totalSalary: 0,
    storeSalary: [],
    weekList: [],
    xAxisData: [],
    weekLoading: false,
    customDate: null,
    minDate: MIN_DATE,
    showSalaryModal: false
  },

  // 页面加载时请求课程列表
  onShow: function () {
    this.onRefresh()
    this.getLocationList()
    this.getCourseTypeList()
    this.asyncCurDate(new Date().getTime())
    this.asyncCustomDate()
  },

  asyncCurDate: function (timestamp) {
    this.setData({
        curDate: timestamp,
        curDateDesc: getCurYearMonthDesc(timestamp)
    })
    this.getHistoryScheduleList()
  },

  asyncCustomDate: function (date) {
      let _customDate = date
      if (!date) {
        _customDate = getMondayAndSunday();
       }
       

      this.setData({
          customDate: _customDate.map(item => formatDate(item)).join(CUSTOM_DATE_SPLIT_KEY)
      })
      this.getWeekScheduleList()
  },

  // 请求课程列表并更新页面数据
  getScheduleList: function () {
    this.setData({
        loading: true
    })
    $get('/miniapp/schedule/getScheduleList')
      .then(res => {
          this.setData({
            list: res
          });
      })
      .finally(() => {
        this.setData({
            loading: false
        })
      })
  },

  getHistoryScheduleList: function () {
    const { curDate } = this.data
    if (!curDate) return

    this.setData({
        historyLoading: true
    })
    $get('/miniapp/schedule/getHistoryScheduleList', {yearMonth: curDate})
      .then(res => {
          const { schedules, totalSalary, storeSalary } = res || {}
          this.setData({
            historyList: schedules,
            totalSalary,
            storeSalary
          });
      })
      .finally(() => {
        this.setData({
            historyLoading: false
        })
      })
  },

  getWeekScheduleList: function () {
    const { customDate } = this.data
    if (!customDate) return

    this.setData({
        weekLoading: true
    })
    const payload = {
        customDate: customDate.split(CUSTOM_DATE_SPLIT_KEY)
    }
    $post('/miniapp/schedule/getWeekScheduleList', payload)
      .then(res => {
          this.setData({
            weekList: res.list,
            xAxisData: res.xAxisData
          });
      })
      .finally(() => {
        this.setData({
            weekLoading: false
        })
      })
  },

  onRefresh: function () {
    this.getScheduleList();  
    this.getHistoryScheduleList();  
    this.getWeekScheduleList()
  },

    // 请求门店列表并更新页面数据
    getLocationList: function () {
        $get('/miniapp/schedule/getLocationList')
          .then(res => {
              this.setData({
                locationList: res,
                locationColor: res.reduce((total, item) => { total[item.description] = item.color; return  total; } , {})
              });
          })
      },

    getCourseTypeList: function () {
        $get('/miniapp/schedule/getCourseTypeList')
          .then(res => {
              this.setData({
                courseTypeList: res
              });
          })
    },

    onCurDatePickerOpen: function () {
        this.setData({
            showCurDatePicker: true
        })
    },

    onCurDatePickerClose: function () {
        this.setData({
            showCurDatePicker: false
        })
    },

    onChangeCurDate: function (e) {
        this.asyncCurDate(e.detail)
        this.onCurDatePickerClose()
    },

    onCustomDatePickerOpen: function() {
        this.setData({
            showCustomDatePicker: true
        })
    },

    onCustomDatePickerClose: function () {
        this.setData({
            showCustomDatePicker: false
        })
    },

    onChangeCurDate: function (e) {
        this.asyncCustomDate(e.detail)
        this.onCustomDatePickerClose()
    },

    onSalaryModalOpen: function() {
        this.setData({
            showSalaryModal: true
        })
    },

    onSalaryModalClose: function() {
        this.setData({
            showSalaryModal: false
        })
    },
});
