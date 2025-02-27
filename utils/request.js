// utils/request.js

// 请求的基础设置
// const baseUrl = 'http://127.0.0.1:3000'; // 开发环境
// const baseUrl = 'http://10.247.18.103:3000'; // 开发环境
const baseUrl = 'https://whpuedison.asia'; // 生产环境

// 获取 openid 并放入请求头
function getOpenidHeaders() {
  const openid = wx.getStorageSync('openid');  // 假设你存储了 openid
  return openid ? { 'openid': openid } : {};
}

// 通用请求方法
function request(method, url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...getOpenidHeaders(),
        ...headers  // 传入的额外请求头
      },
      success(res) {
        if (res.data.code === 200) {
          resolve(res.data.data); // 请求成功，返回数据
        } else {
          reject(new Error(`Error: ${res.data.code}`)); // 请求失败
        }
      },
      fail(error) {
        reject(error); // 请求失败，返回错误信息
      }
    });
  });
}

// 封装 GET 请求
function $get(url, data = {}, headers = {}) {
  return request('GET', url, data, headers);
}

// 封装 POST 请求
function $post(url, data = {}, headers = {}) {
  return request('POST', url, data, headers);
}

// 导出工具方法
module.exports = {
  $get,
  $post
};
