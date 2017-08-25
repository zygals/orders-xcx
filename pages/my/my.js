// pages/my/my.js
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;
var username = wx.getStorageSync('username');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  userInfo:{},
  username:username,
  },
  getInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          userInfo: userInfo,
        });
        //将用户信息：头像和昵称发送服务器
        /*wx.request({
          url: wxurl + 'wx.php/user/save',
          data: {
            'name': username,
            'vistar': userInfo.avatarUrl,
            'nickname': userInfo.nickName,
            'sex': userInfo.gender,
          },
          success: function (res) {
            //console.log('yes info');
          }
        })*/
      },//如果不同意则提示用户设置为同意
      fail: function () {
        wx.openSetting({
          success: function (data) {
            if (data) {
              if (data.authSetting["scope.userInfo"] == true) {
                that.getInfo();
              } else {
                console.log('没有同意用户信息')
              }
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
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