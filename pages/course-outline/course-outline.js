const { $post } = require('../../utils/request.js');

Page({
  data: {
    outline: '',
    loading: false,
    courseName: '',
    courseType: '',
    error: null
  },

  onLoad: function(options) {
    const {courseName, courseType } = options;
    const payload = { courseName, courseType }
    this.setData(payload)
    this.fetchCourseOutline(payload);
  },
 
  fetchCourseOutline: function(payload) {
      this.setData({ loading: true })
    $post('/miniapp/schedule/getCourseOutline', payload)
        .then(res => {
            this.setData({ outline: res })
        })
        .finally(() => {
            this.setData({ loading: false })
        })
  }
});