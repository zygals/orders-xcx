// pages/orders/orders.js  我的所有订单
var common = require("../../utils/util.js");
var app = getApp();
var wxurl = app.globalData.wxurl;
var imgurl = app.globalData.imgurl;

const IN_ = app.globalData.in_;//堂食
const OUT_ = app.globalData.out_;//送s

Page({

  /**
   * 页面的初始数据
   */
  data: {
   orders:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //取我的所有订单
    this.getOrders();
  },
  //请求所有订单方法
  getOrders: function () {
    var that = this;
    var username = wx.getStorageSync('username');
    if (!username){
      app.register();
      username = wx.getStorageSync('username');
    }
    common.httpG(
      wxurl + 'order/',
      {
        username: username
      },
      function (res) {
        that.setData({
          orders: res.data.data
        });
        wx.setStorage({
          key: 'orders_goods',
          data: res.data.data,
        })
      }
    );
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var order_id = e.target.dataset.order_id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消吗？取消后不可恢复',
      success: function (res) {
        if (res.confirm) {
          //确定要删除则请求删除接口
          common.httpG(wxurl + 'order/update_st', { order_id: order_id, status: "cancel" }, function (obj) {
            wx.showToast({
              title: '订单取消成功',
            })
            that.getOrders();
          });
        }
      }
    });

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