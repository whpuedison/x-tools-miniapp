const { $post } = require('../../utils/request.js');  // 引入接口调用方法

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    list: {
        type: Array,
        value: []
    },
    loading: {
        type: Boolean,
        value: false
    },
    showAddBtn: {
        type: Boolean,
        value: false
    },
    locationList: {
        type: Array,
        value: []
    },
    locationColor: {
        type: Object,
        value: {}
    },
    courseTypeList: {
        type: Array,
        value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showFormPop: false,
    currentCourse: null,
    lastTapTime: 0,
    lastTapId: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
     onViewOutline(e) {
        const { item } = e.currentTarget.dataset;
        const { courseName, courseType } = item;
        
        wx.navigateTo({
            url: `/pages/course-outline/course-outline?courseName=${courseName}&courseType=${courseType.description}`
        });
    },
    
    // 点击新增按钮，显示表单
    onAddCourse: function () {
        this.setData({
            showFormPop: true,
            currentCourse: null // 重置表单内容
        });
    },

    refreshList: function() {
        this.triggerEvent('refresh');
    },

    // 删除课程
    onDeleteCourse: function(e) {
        const scheduleId = e.currentTarget.dataset.id;  // 获取课程的id
        wx.showModal({
            title: '确认删除',
            content: '你确定要删除这门课程吗？',
            success: (res) => {
            if (res.confirm) {
                // 用户点击了确认
                $post('/miniapp/schedule/deleteSchedule', { scheduleId })
                .then(() => {
                    this.refreshList()
                })
            }
            }
        });
    },

    // 复制课程
    onCopyCourse: function(e) {
        const { item } = e.currentTarget.dataset;
        this.setData({
            showFormPop: true,
            currentCourse: { ...item, courseDate: item.fullDate, id: undefined }
        })
    },


    // 编辑课程
    onEditCourse: function(e) {
            const { item } = e.currentTarget.dataset;
            this.setData({
                showFormPop: true,
                currentCourse: { ...item, courseDate: item.fullDate }
            })
        },

    // 取消编辑
    onCancelEdit: function () {
        this.setData({
            showFormPop: false  // 关闭弹出表单
        });
    },

    // 关闭弹出表单
    onCloseFormPop: function () {
        this.setData({
            showFormPop: false  // 关闭弹出表单
        });
    }
  }
})