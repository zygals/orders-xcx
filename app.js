//app.js
App({
  onLaunch: function () {
    //
    var  username = wx.getStorageSync('username');
    if(!username){
      this.register();
    }
 
  },
  onHide: function () {
    // Do something when hide.
  
  },
  //注册
  register:function(){
    var that = this;
    // Do something initial when launch.
    //当程序开启时，自动完成注册功能 
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求,注册用户
          wx.request({
            url: that.globalData.wxurl + 'user',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log('login-',res.data)
              try {
                wx.setStorageSync('username', res.data.data)
              } catch (e) {
                wx.showToast({
                  title: 'setStorageSync fail',
                  duration: 10000
                })
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData:{
    wxurl:"https://huahui.qingyy.net/orders/public/wx.php/",
    wxshopurl: "https://huahui.qingyy.net/orders/public/wx_shop.php/",
    imgurl: "https://huahui.qingyy.net/orders/public/",
    in_:1,
    out_:2
  }
})