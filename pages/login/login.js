// pages/login/login.js
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxshopurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  loginFormSubmit: function (e) {
    console.log(e);
    var name = common.trim(e.detail.value.name), pass = common.trim(e.detail.value.pass);
    if (name == '' || pass == '') {
      wx.showToast({
        title: '用户名或密码不能为空', //包含空字符串或是全部空格情况
      })
      return;
    }
    common.httpP(wxurl + "admin/check_pass", { name: name, pass: pass }, function (res) {
      if (res.data.code == 0) {
        //登录成功
        wx.showToast({
          title: res.data.msg,
        })
        //console.log('dddsfsfdsafd');
        wx.setStorageSync("admin_name", res.data.data.name);
        wx.redirectTo({
          url: '/pages/address/address',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})