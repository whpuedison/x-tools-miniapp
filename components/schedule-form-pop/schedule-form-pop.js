const { $post } = require('../../utils/request.js');
const { getMinDate, formatDate } = require('../../utils/util.js');
const MIN_DATE = getMinDate()

Component({
    properties: {
      show: {
        type: Boolean,
        value: false
      },
      locationList: {
        type: Array,
        value: []
      },
      courseTypeList: {
        type: Array,
        value: []
      },
      schedule: {
          type: Object,
          value: {}
      }
    },
  
    data: {
      showStartTimePicker: false,
      showEndTimePicker: false,
      showLocationPicker: false,
      showCourseDatePicker: false,
      showCourseTypePicker: false,
      courseName: '',
      startTime: '',
      endTime: '',
      location: '',
      courseDate: '',
      courseType: {},
      minDate: MIN_DATE,
    },

    observers: {
        // 监听 schedule 的变化，更新表单字段
        'schedule': function (newSchedule) {
          if (newSchedule && Object.keys(newSchedule).length > 0) {
            this.setData({
              courseName: newSchedule.courseName || '',
              startTime: newSchedule.startTime || '',
              endTime: newSchedule.endTime || '',
              location: newSchedule.location || '',
              courseDate: newSchedule.courseDate || '',
              courseType: newSchedule.courseType || {}
            });
          }
        }
      },   
  
    methods: {
      // 课程名称变化时更新数据
      onCourseNameChange(event) {
        this.setData({
          courseName: event.detail
        });
      },
  
      // 打开课程开始时间选择器
      onStartTimePickerOpen() {
        this.setData({
          showStartTimePicker: true
        });
      },
  
      // 打开课程结束时间选择器
      onEndTimePickerOpen() {
        this.setData({
          showEndTimePicker: true
        });
      },
  
      // 打开地点选择器
      onLocationPickerOpen() {
        this.setData({
          showLocationPicker: true
        });
      },
  
      onCourseDatePickerOpen() {
        this.setData({
            showCourseDatePicker: true
        });
      },

      onCourseTypePickerOpen() {
        this.setData({
            showCourseTypePicker: true
        });
      },

     // 选择开始时间
    onStartTimeChange(e) {
        const newStartTime = e.detail;
        const { endTime } = this.data;

        if (endTime) {
            const startDate = new Date(`1970-01-01T${newStartTime}:00Z`);
            const endDate = new Date(`1970-01-01T${endTime}:00Z`);

            if (endDate <= startDate) {
                // 如果开始时间晚于结束时间，提示错误
                this.setData({
                    errorMessage: '开始时间必须早于结束时间',
                    showStartTimePicker: false,
                    startTime: newStartTime 
                });
                return;
            }
        }

        // 如果没有结束时间或者开始时间合法，更新开始时间
        this.setData({
            errorMessage: '',
            startTime: newStartTime,
            showStartTimePicker: false
        });
    },

    // 选择结束时间
    onEndTimeChange(e) {
        const newEndTime = e.detail;
        const { startTime } = this.data;

        if (startTime) {
            const startDate = new Date(`1970-01-01T${startTime}:00Z`);
            const endDate = new Date(`1970-01-01T${newEndTime}:00Z`);

            if (endDate <= startDate) {
                // 如果结束时间早于或等于开始时间，提示错误
                this.setData({
                    errorMessage: '结束时间必须晚于开始时间',
                    showEndTimePicker: false,
                    endTime: newEndTime 
                });
                return;
            }
        }

        // 如果没有开始时间或者结束时间合法，更新结束时间
        this.setData({
            errorMessage: '',
            endTime: newEndTime,
            showEndTimePicker: false
        });
    },

  
      // 选择地点变化时更新数据
      onLocationChange(event) {
        this.setData({
          location: event.detail.value.description,
          showLocationPicker: false
        });
      },

      onCourseTypeChange(event) {
        this.setData({
          courseType: event.detail.value,
          showCourseTypePicker: false
        });
      },
  
      // 选择课程日期
      onCourseDateChange(event) {
        this.setData({
          courseDate: formatDate(event.detail),
          showCourseDatePicker: false
        });
      },

       // 关闭整个表单弹窗
     onClose() {
        // 关闭弹窗时重置表单数据
        this.setData({
          show: false,
          courseType: {},
          courseName: '',  // 清除课程名称
          startTime: '',
          endTime: '',
          location: '',
          courseDate: '',
          errorMessage: '' // 清除错误信息
         });
      },
  
      // 保存并关闭弹窗
      onSave() {
        const { courseName, startTime, courseType, endTime, location, courseDate } = this.data;
  
        // 校验所有表单项是否填写
        if (!courseName || !startTime || !endTime || !location || !courseDate || !courseType.id) {
          this.setData({
            errorMessage: '所有字段都是必填项，请完成填写'
          });
          return;
        }

        this.setData({
          errorMessage: '' // 清除错误信息
        });

        const { id } = this.properties.schedule || {};
        const payload = {
             id, courseName, startTime, endTime, location, courseDate, courseType 
        }
        const path = id ? '/miniapp/schedule/editSchedule' : '/miniapp/schedule/addSchedule'
        $post(path, payload)
          .then(() => {
            this.onClose()
            this.triggerEvent('refresh');
          })
      },
  
      // 关闭课程开始时间选择器
      onCloseStartTimePicker() {
        this.setData({
          showStartTimePicker: false
        });
      },
  
      // 关闭课程结束时间选择器
      onCloseEndTimePicker() {
        this.setData({
          showEndTimePicker: false
        });
      },
  
      // 关闭地点选择器
      onCloseLocationPicker() {
        this.setData({
          showLocationPicker: false
        });
      },
  
      // 关闭周几选择器
      onCloseCourseDatePicker() {
        this.setData({
            showCourseDatePicker: false
        });
      },

      onCloseCourseTypePicker() {
        this.setData({
            showCourseTypePicker: false
        });
      },
    },
  });
  