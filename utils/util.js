 // 设置最小日期为当前日期的一个月前
 const getMinDate = function() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);  // 设置为一个月前
    return currentDate.getTime();
}  

const getCurYearMonthDesc = function(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}年${month}月`;
}

// 设置最大日期为当前月的最后一天
const getMaxDate = function() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1, 0);  // 设置为下一个月的第0天，也就是当前月的最后一天
    return currentDate.getTime();
}

const formatDate = function(date) {
    date = new Date(date); // 将输入的日期转为 Date 对象
    const year = date.getFullYear(); // 获取年份并取最后两位
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，注意月份从 0 开始，所以加 1，并确保是两位数
    const day = date.getDate().toString().padStart(2, '0'); // 获取日期，并确保是两位数
    return `${year}-${month}-${day}`; // 返回 yy-mm-dd 格式
 }

 const getMondayAndSunday = function() {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    // 计算本周的开始日期（周一）和结束日期（周日）
    const daysToMonday = (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1);
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday); // 设置为本周一
  
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // 设置为本周日
  
    // 格式化为 'yyyy-mm-dd' 形式，避免时区差异
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const mondayStr = monday.toLocaleDateString('en-CA', options).replace(/\//g, '-');
    const sundayStr = sunday.toLocaleDateString('en-CA', options).replace(/\//g, '-');
    return [mondayStr, sundayStr]
  }

  // 导出工具方法
module.exports = {
    getMinDate,
    getMaxDate,
    getCurYearMonthDesc,
    formatDate,
    getMondayAndSunday
};
  