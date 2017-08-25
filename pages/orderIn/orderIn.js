// pages/orderIn/orderIn.js
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;
var username = wx.getStorageSync('username');
const IN_ = app.globalData.in_;//堂食
const OUT_ = app.globalData.out_;//送
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderGoods: [],
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var new_order_id = options.new_order_id;
    //根据订单号查询里面商品
    common.httpG(wxurl + "order/get_order", {
      'order_id': new_order_id,
      'type': IN_
    },
      function (res) {
        that.setData({
          orderGoods: res.data.data.order_goods,
          order: res.data.data.order
        });

      });
    //console.log(new_order_id);

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