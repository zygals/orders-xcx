function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function inArray(arr, obj) {
  var len = arr.length;//4

  while (len--) {
    if (arr[len] == obj) {
      return true;
    }
  }
  return false;
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function httpG(url, data, callback) {
  wx.showLoading({
    title: '努力加载中^^...',
  })
  wx.request({
    url: url,
    data: data,
    success: function (res) {
      if (res.data.code == 0) {
        callback(res);
      }
    },
    fail: function (res) {
      console.log('request-get error:', res);

    },
    complete: function (res) {
      wx.hideLoading();
      console.log("get-complete:", res.data)
      if (res.data.code != 0) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }
  })
}
function httpP(url, data, callback) {
  wx.request({
    url: url,
    data: data,
    method: "post",
    success: function (res) {
      callback(res);
    },
    fail: function (res) {
      console.log('request-post error:', res);
    },
    complete: function (res) {
      console.log("post-complete:", res.data)
      if (res.data.code != 0) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }
  })
}
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}



module.exports = {
  formatTime: formatTime,
  httpP: httpP,
  httpG: httpG,
  trim: trim,
  inArray: inArray,
  
}
